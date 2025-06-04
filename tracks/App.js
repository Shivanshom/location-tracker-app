import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import AccountScreen from "./src/screens/AccountScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import TrackDetailScreen from "./src/screens/TrackDetailScreen";
import TrackListScreen from "./src/screens/TrackListScreen";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { PaperProvider } from "react-native-paper";
import { setNavigator } from "./src/navigationRef";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import { Provider as LocationProvider } from "./src/context/LocationContext";
import { Provider as TrackProvider } from "./src/context/TrackContext";
import { FontAwesome } from "@expo/vector-icons";
import TrackCreateScreen from "./src/screens/TrackCreateSceen";
import { ScreenStackHeaderBackButtonImage } from "react-native-screens";
import { HeaderBackButton } from "@react-navigation/elements";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

// Track List Flow
function TrackListFlow() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{headerLeft:null}} name="TrackList" component={TrackListScreen} />
      <Stack.Screen name="TrackDetail" component={TrackDetailScreen} />
    </Stack.Navigator>
  );
}

// Main Flow Tabs
function MainFlow() {
  return (
    <Tab.Navigator
      initialRouteName="TrackListFlow"
      shifting={true}
      barStyle={{ backgroundColor: "#6200ee" }}
      screenOptions={({ route }) => ({

        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "TrackListFlow") {
            iconName = "th-list";
          } else if (route.name === "TrackCreate") {
            iconName = "plus";
          } else if (route.name === "Account") {
            iconName = "user";
          }

          return <FontAwesome name={iconName} size={20} color={color} />;
        },
        
      })}
    >
      <Tab.Screen
        name="TrackListFlow"
        component={TrackListFlow}
        options={{ title: "Tracks" }}
      />
      <Tab.Screen
        name="TrackCreate"
        component={TrackCreateScreen}
        options={{ title: "Create" }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
      />
    </Tab.Navigator>
  );
}

// App Navigator
function AppNavigator() {
  return (
    <NavigationContainer
      ref={(navigator) => {
        setNavigator(navigator);
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ResolveAuth" component={ResolveAuthScreen} />
        <Stack.Screen name="LoginFlow">
          {() => (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="Signin" component={SigninScreen} />
            </Stack.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen   name="MainFlow"  component={MainFlow} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Export App
export default () => {
  return (
    <TrackProvider>
      <LocationProvider>
        <AuthProvider>
          <PaperProvider>
            <AppNavigator />
          </PaperProvider>
        </AuthProvider>
      </LocationProvider>
    </TrackProvider>
  );
};
