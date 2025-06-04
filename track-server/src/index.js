require('./models/User');
require('./models/Track');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
// const bodyParser = require('body-parser');
const requireAuth = require('./middlewares/requireAuth');
const trackRoutes = require('./routes/trackRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri = 'mongodb+srv://roskom16122002:Shivanshom1234@cluster0.6ps1aqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(mongoUri);

mongoose.connection.on('connected',()=>{
    console.log('Connected to mongo instance');
});

mongoose.connection.on('error',(err)=>{
    console.log('Error connecting to mongo',err);
});

app.get('/', requireAuth, (req,res)=>{
    console.log(`Request to: ${req.originalUrl}`);
    res.send(`Your email: ${req.user.email}`);
});

app.listen(3000,()=>{
    console.log('listening on port 3000');
});