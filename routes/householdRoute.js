
var express = require("express");

var router = express.Router();

//POST
router.post('/', (req, res) => {
    var household = req.body;
    Household.addHousehold(household,(err, household) => { 
        if(err){
            throw err;
        }
        res.json(household)
    }); 
});

router.post('/:_id/familyMembers', (req, res) => {
    var familyMember = req.body;
    Household.addFamilyMembersByHouseId(req.params._id, familyMember,(err, familyMember) => { 
        if(err){
            throw err;
        }
        res.json(familyMember)
    }); 
});


//GET
router.get('/', (req, res) => {
    Household.getHouseholds((err, households) => { 
        if(err){
            throw err;
        }
        res.json(households)
    }); 
});

router.get('/TEST', (req, res) => {
    Household.testAgg((err, household) => { 
        if(err){
            throw err;
        }
        res.json(household)
    }); 

    // Household.getAggTEST();
});

router.get('/:_id', (req, res) => {
    Household.getHouseholdById(req.params._id, (err, household) => { 
        if(err){
            throw err;
        }
        res.json(household)
    }); 
});

router.get('/:_id/familyMembers', (req, res) => {
    Household.getFamilyMembersByHouseId(req.params._id, (err, household) => { 
        if(err){
            throw err;
        }
        res.json(household)
    }); 
});


module.exports = router;