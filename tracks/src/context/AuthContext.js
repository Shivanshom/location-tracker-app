import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
    switch (action.type) {
        case "add_error":
            return { ...state, errorMessage: action.payload };
        case "signin":
            return { errorMessage: "", token: action.payload };
        case "clear_error_message":
            return { ...state, errorMessage: "" };
        case "signout":
            return { token: null, errorMessage: "" };
        default:
            return state;
    }
};

const tryLocalSignin = (dispatch) => async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      dispatch({ type: "signin", payload: token });
      navigate("MainFlow"); // Navigate to MainFlow if signed in
    } else {
      navigate("LoginFlow", { screen: "Signup" }); // Correct nested navigation
    }
  };
  

const clearErrorMessage = (dispatch) => () => {
    dispatch({ type: "clear_error_message" });
};

const signup =
    (dispatch) =>
        async ({ email, password }) => {
            try {
                const response = await trackerApi.post("/signup", { email, password });
                await AsyncStorage.setItem("token", response.data.token);
                dispatch({ type: "signin", payload: response.data.token });

                navigate("MainFlow", {screen: "TrackList"}); // Correct nested navigation
            } catch (err) {
                console.log(err);
                dispatch({
                    type: "add_error",
                    payload: "Something went wrong with sign up",
                });
            }
        };

const signin =
    (dispatch) =>
        async ({ email, password }) => {
            try {
                console.log("Signing in with:", email, password); // Log input

                const response = await trackerApi.post("/signin", { email, password });
                console.log("Signin response:", response.data); // Log response

                await AsyncStorage.setItem("token", response.data.token);
                dispatch({ type: "signin", payload: response.data.token });
                navigate("MainFlow", {screen: "TrackList"}); // Correct nested navigation
            } catch (err) {
                console.log("Signin error:", err); // Log error
                if (err.request) {
                    console.log("Request error:", err.request);
                }
                dispatch({
                    type: "add_error",
                    payload: "Something went wrong with sign in",
                });
            }
        };

const signout = (dispatch) => async () => {
    await AsyncStorage.removeItem("token");
    dispatch({ type: "signout" });
    navigate("LoginFlow", { screen: "Signup" }); // Correct nested navigation
};

export const { Provider, Context } = createDataContext(
    authReducer,
    { signin, signout, signup, clearErrorMessage, tryLocalSignin },
    { token: null, errorMessage: "" }
);
