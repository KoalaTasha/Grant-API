var express = require("express");

var router = express.Router();

router.get('/help', (req, res) => {
    var note = "All posts' content need to be written in body in JSON format \n\n"
    var h1 = "VERB: GET, URL: /api/households -->  will get all households\n";
    var h2 = "VERB: POST, URL: /api/households -->  add one household\n";
    var h3 = "VERB: GET, URL: /api/households/~household_id~ -->  will get one household\n";
    var h4 = "VERB: GET, URL: /api/households/~household_id~/familyMembers -->  will get one household's family members\n";
    var h5 = "VERB: POST, URL: /api/households/~household_id~/familyMembers -->  add family members to one household\n";

    res.send(note + h1 + h2 + h3 + h4 + h5 );
});

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