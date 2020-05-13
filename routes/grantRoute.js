
var express = require("express");

var router = express.Router();


router.get('/options', (req, res) => {
// get all the grants + their ids
    res.send('all grants: /api/grants?fm_age_gt=50');
});

function findOptions(options) {
    var find = {};
    if (options.length == 0)
       find["$nin"] = options;
    else
       find["$in"] = options;
    return find;
 }


function sanitizeInputs(in_query, query){
    if (in_query.fm_age_gt) query.fm_age_gt = Number(in_query.fm_age_gt);
    if (in_query.fm_age_lt) query.fm_age_lt = Number(in_query.fm_age_lt);
    if (in_query.house_type) query.house_type = findOptions([in_query.house_type]);
    if (in_query.has_couple) query.has_couple = findOptions([in_query.has_couple == "true"]);
    if (in_query.hh_income_lt) query.hh_income_lt = Number(in_query.hh_income_lt);

    return query
}

// '/api/grants'
router.get('/', (req, res) => {
    // default query
    var query = {hh_income_lt: Infinity, fm_age_lt: Infinity, fm_age_gt: 0, has_couple:findOptions([]), house_type: findOptions([]) };

    if (Object.keys(req.query).length == 0) {
        res.send("format: /api/grants?hh_income_lt=1100&" +" available fields : "+ Object.keys(query));  // todo fix formatting
        
    } else {
        //Sanitize the query before passing it to db
        // console.log(req.query.house_type);  //--> house_type=HDB&house_type=LANDED  --> [ 'HDB', 'LANDED' ]
        query = sanitizeInputs(req.query, query)
        Household.testAggInput(query , (err, household) => { 
            if(err){
                throw err;
            }
            res.json(household)
        }); 
    }
});


module.exports = router;