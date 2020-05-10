var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// app.use(bodyParser.json());

Household = require('./models/household');

// Connect to Mongoose
mongoose.connect('mongodb://localhost/grant-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
} )

var db = mongoose.connection;

// routes
app.get('/',  (req, res) => {
    res.send('hello world!!');
});

app.get('/api/households', (req, res) => {
    Household.getHousehold((err, households) => { 
        if(err){
            throw err;
        }
        res.json(households)
    });
});

app.post("/", (req, res) =>{
    console.log(req.body);
});

// listen to server
app.listen(3000);
console.log("Running on port 3000");