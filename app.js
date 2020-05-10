var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json());

// Connect to Mongoose
mongoose.connect('mongodb://localhost/grant-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
} )

var db = mongoose.connection;

// Models
Household = require('./models/household');

// routes
var householdRoute = require('./routes/householdRoute');
app.use('/api/households', householdRoute);

var grantRoute = require('./routes/grantRoute');
app.use('/api/grants', grantRoute);

app.get('/',  (req, res) => {
    res.send('hello world!!');
});


// app.post("/", (req, res) =>{
//     console.log(req.body);
// });

// listen to server
app.listen(3000);
console.log("Running on port 3000");