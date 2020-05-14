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

// check if input JSON is valid JSON
app.use((err, req, res, next) => {  
    if (err instanceof SyntaxError) return res.status(400).send(JSON.stringify({
        error: "Invalid JSON"
    }))
    res.status(500).send();
  });

// Models
Household = require('./models/household');

// routes
var householdRoute = require('./routes/householdRoute');
app.use('/api/households', householdRoute);

var grantRoute = require('./routes/grantRoute');
app.use('/api/grants', grantRoute);

app.get('/',  (req, res) => {
    var household = " Go to http://localhost:3000/api/households for editing or viewing of households \n";
    var grants = "Go to http://localhost:3000/api/grants for query on eligible households for grants \n";

    res.send(household+ grants + " \n for help add /help to the url");
});

// listen to server
app.listen(3000);
console.log("Running on port 3000");