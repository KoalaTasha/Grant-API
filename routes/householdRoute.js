var express = require("express");

var router = express.Router();

router.get('/help', (req, res) => {
    var note = "All posts' content need to be written in body in JSON format \n\n"
    var t1 = "Household:\n";
    var h1 = "VERB: GET, URL: /api/households -->  will get all households\n";
    var h2 = "VERB: POST, URL: /api/households -->  add one household\n";
    var t2 = "Specific household:\n";
    var h3 = "VERB: GET, URL: /api/households/~household_id~ -->  will get one household\n";
    var h4 = "VERB: DELETE, URL: /api/households/~household_id~ -->  will delete one household\n";
    var t3 = "Specific household's family member(s):\n";
    var h5 = "VERB: GET, URL: /api/households/~household_id~/familyMembers -->  will get one household's family members\n";
    var h6 = "VERB: POST, URL: /api/households/~household_id~/familyMembers -->  add family members to one household\n";
    var h7 = "VERB: DELETE, URL: /api/households/~household_id~/familyMembers/~familymem_id~ -->  delete one family member from one household\n";

    res.send(note + t1 + h1 + h2 + t2 + h3 + h4 + t3 + h5 + h6 + h7 );
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


//DEL
router.delete('/:_id', (req, res) => {
    Household.delHouseholdById(req.params._id,(err, familyMember) => { 
        if(err){
            throw err;
        }
        res.json(familyMember)
    }); 
});

router.delete('/:_id/familyMembers/:_idFM', (req, res) => {
    Household.delFamilyMembersByHouseId(req.params._id,req.params._idFM, (err, household) => { 
        if(err){
            throw err;
        }
        res.json(household)
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