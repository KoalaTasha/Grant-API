var express = require("express");

var router = express.Router();

router.get('/help', (req, res) => {
    var note = "All posts' content need to be written in body in JSON format \n\n"
    var t1 = "Household:\n";
    var h1 = "VERB: GET, URL: /api/households -->  will get all households\n";
    var h2 = "VERB: POST, URL: /api/households -->  add one household. To add multiple, put in array\n";
    var t2 = "Specific household:\n";
    var h3 = "VERB: GET, URL: /api/households/~household_id~ -->  will get one household\n";
    var h4 = "VERB: DELETE, URL: /api/households/~household_id~ -->  will delete one household\n";
    var t3 = "Specific household's family member(s):\n";
    var h5 = "VERB: GET, URL: /api/households/~household_id~/familyMembers -->  will get one household's family members\n";
    var h6 = "VERB: POST, URL: /api/households/~household_id~/familyMembers -->  add family members to one household\n";
    var h7 = "VERB: DELETE, URL: /api/households/~household_id~/familyMembers/~familymem_id~ -->  delete one family member from one household\n";

    res.send(note + t1 + h1 + h2 + t2 + h3 + h4 + t3 + h5 + h6 + h7 );
});

function jsonFormatCorrect(inp, format) { 
    var input = Object.keys(inp);
    var jsonformat =Object.keys( JSON.parse(format));
    return jsonformat.every(val => input.includes(val)); 
 }

//POST

// add household
router.post('/', (req, res) => {
    var household = req.body;
    Household.addHousehold(household,(err, household) => { 
        if(err){
            res.send("Please enter in JSON format \n\n Error: \n" + err);
        }
        res.json(household)
    }); 
});

// add a family member to household with ID = _id
router.post('/:_id/familyMembers', (req, res) => {
    var familyMember = req.body;
    var formatCorrect = jsonFormatCorrect(familyMember, '{ "name":"","gender":"", "DOB":""}'); // crude check that input is in correct

    Household.getHouseholdById(req.params._id, (err, household) => { 
        if(err || household == null){   // check if household exists
            res.send("Please enter valid household ID");
        } else if (formatCorrect){  // If household exists, check if JSON format is correct, then add FM
            Household.addFamilyMembersByHouseId(req.params._id, familyMember,(err1, familyMember) => { 
                if(err1){
                    res.send("Please enter in JSON format, with valid household ID \n\n Error: \n" + err);
                }
                res.json(familyMember);
            }); 
        } else {
            res.send("Please enter in JSON format with required fields for one family member (name, gender, DOB)");
        }
    });
});


//DEL

// Delete household with ID = _id
router.delete('/:_id', (req, res) => {
    Household.delHouseholdById(req.params._id,(err, familyMember) => { 
        if(err){
            res.send("Please enter valid household ID \n\n Error: \n" + err);
        }
        res.json(familyMember)
    }); 
});

// Del family member with ID = _idFM from household with ID = _id
router.delete('/:_id/familyMembers/:_idFM', (req, res) => {
    Household.delFamilyMembersByHouseId(req.params._id,req.params._idFM, (err, household) => { 
        if(err){
            res.send("Please enter valid household ID and valid Family member ID \n\n Error: \n" + err);
        }
        res.json(household)
    }); 
});

//GET

// Get all households and family members in each household
router.get('/', (req, res) => {
    Household.getHouseholds((err, households) => { 
        if(err){
            res.send("Could not get all Households \n\n Error: \n" + err);
        }
        res.json(households)
    }); 
});

// Get household with ID = _id and family members in that household
router.get('/:_id', (req, res) => {
    Household.getHouseholdById(req.params._id, (err, household) => { 
        if(err){
            res.send("Please enter valid household ID \n\n Error: \n" + err);
        }
        res.json(household)
    }); 
});

// Get family members in household with ID = _id 
router.get('/:_id/familyMembers', (req, res) => {
    Household.getFamilyMembersByHouseId(req.params._id, (err, household) => { 
        if(err){
            res.send("Please enter valid household ID \n\n Error: \n" + err);
        }
        res.json(household)
    }); 
});


module.exports = router;