
var express = require("express");

var router = express.Router();


router.get('/options', (req, res) => {
// get all the grants + their ids
    res.send('all grants: /api/grants?fm_age_gt=50');
});

// '/api/grants'
router.get('/', (req, res) => {
    var query = {hh_income_lt: Infinity, fm_age_gt: 0, house_type: null};

    if (Object.keys(req.query).length == 0) {
        res.send("format: /api/grants?hh_income_lt=1100&" +" available fields : "+ Object.keys(query));  // todo fix formatting
        
    } else {
        //Sanitize the query before passing it to db
        if (req.query.hh_income_lt) query.hh_income_lt = Number(req.query.hh_income_lt);
        if (req.query.fm_age_gt) query.fm_age_gt = Number(req.query.fm_age_gt);
        if (req.query.house_type) query.house_type = req.query.house_type;

        Household.testAggInput(query , (err, household) => { 
            if(err){
                throw err;
            }
            res.json(household)
        }); 
    }
});



module.exports = router;