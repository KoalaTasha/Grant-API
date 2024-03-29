
var express = require("express");

var router = express.Router();


router.get('/help', (req, res) => {
// example format for query
    var format = "format: /api/grants?[field: value]&[field: value] \n \n";
    var g1 = "Student Encouragement Bonus:  http://localhost:3000/api/grants?fm_age_lt=16&hh_income_lt=150000 \n";
    var g2 = "Family Togetherness Scheme:  http://localhost:3000/api/grants?fm_age_lt=16&has_couple=true \n ";
    var g3 = "Elder Bonus:  http://localhost:3000/api/grants?house_type=HDB&fm_age_gt=50 \n "
    var g4 = "Baby Sunshine Grant:  http://localhost:3000/api/grants?fm_age_lt=5 \n "
    var g5 = "YOLO GST Grant:  http://localhost:3000/api/grants?house_type=HDB&hh_income_lt=100000 \n "
    
    res.send(format+ 'Example grants: \n' + g1 + g2 + g3 + g4 + g5 );
});

function findOptions(options) {  // format input into a query
    if (Array.isArray(options) == false)
        options = [options]
    var find = {};
    if (options.length == 0)
       find["$nin"] = options;
    else
       find["$in"] = options;
    return find;
 }


function sanitizeInputs(in_query, query){
    if (in_query.fm_age_gt) 
        query.fm_age_gt = Number(in_query.fm_age_gt);   
        if (Array.isArray(in_query.fm_age_gt))  // incase multiple of this field entered, just take the first one
            query.fm_age_gt = Number(in_query.fm_age_gt[0]);

    if (in_query.fm_age_lt) 
        query.fm_age_lt = Number(in_query.fm_age_lt);
        if (Array.isArray(in_query.fm_age_lt))  // incase multiple of this field entered, just take the first one
            query.fm_age_lt = Number(in_query.fm_age_lt[0]);

    if (in_query.hh_income_lt) 
        query.hh_income_lt = Number(in_query.hh_income_lt);
        if(Array.isArray(in_query.hh_income_lt))  // incase multiple of this field entered, just take the first one
            query.hh_income_lt = Number(in_query.hh_income_lt[0]);

    if (in_query.house_type) query.house_type = findOptions(in_query.house_type);  //If multiple entries entered, will find households that match one of the options

    if (in_query.has_couple)    // only accept "true" of "false"
        if(in_query.has_couple == "true")  
            query.has_couple = findOptions(true);
        if(in_query.has_couple == "false")
            query.has_couple = findOptions(false);

    return query
}

// '/api/grants'
router.get('/', (req, res) => {
    // default query, that doesn't filter anything
    var query = {hh_income_lt: Infinity, fm_age_lt: Infinity, fm_age_gt: 0, has_couple:findOptions([]), house_type: findOptions([]) };

    if (Object.keys(req.query).length == 0) { // if no inputs provided for query
        res.send("go to http://localhost:3000/api/grants/help for help and examples" +"\n  available fields : "+ Object.keys(query));  
        
    } else {
        //Sanitize the query before passing it to db
        query = sanitizeInputs(req.query, query)
        Household.getEligibleByInput(query , (err, household) => { 
            if(err){
                res.send("Please enter valid query format \n\n Error: \n" + err);
            }
            res.json(household)
        }); 
    }
});


module.exports = router;