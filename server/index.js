// THESE ARE NODE APIs WE WISH TO USE
const express = require('express');
const app = express();
const ejsEngine = require('ejs-mate');

const mongoose = require('mongoose');

// SETUP THE MIDDLEWARE
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.engine('ejs', ejsEngine);
app.use(express.static(path.join(__dirname, '../public')));

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const authRouter = require('./routes/user-router')
app.use('/auth', authRouter)

// INITIALIZE OUR DATABASE OBJECT
const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// PUT THE SERVER IN LISTENING MODE
app.listen(80, () => {
    console.log("Listening on port 80!");
})