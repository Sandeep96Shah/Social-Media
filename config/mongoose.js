//acquiring the mongoose library
const mongoose = require('mongoose');

//creating the connection to the mongoDB database
mongoose.connect('mongodb://localhost/codeial_development');

//acquring the connection
const db = mongoose.connection;

//if error occured then this will run
db.on('error',console.error.bind(console,'error while connecting to the database'));

//if connection happens successful then this will run
db.once('open',function(){
    console.log('yup!,Successfully connected to the database::mongoDB');
});

module.exports = db;