var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to Mongoose
mongoose.connect('mongodb://localhost/households', {
    useNewUrlParser: true,
    useUnifiedTopology: true
} )

var db = mongoose.connection;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world!!')
})

// listen to server
app.listen(3000);
console.log("Running on port 3000");