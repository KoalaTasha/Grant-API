var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var familyMembersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    occupationType: {
        type: String,
        required: true
    },
    DOB: {
        type: Date
        // required: true
        //todo: fix
    },


    martialStatus: Boolean,
    spouse: String,
    annualIncome: Number
});

var householdSchema = new Schema({
    housingType: String,
    familyMembers: [familyMembersSchema]
});

var Household = module.exports = mongoose.model("Household", householdSchema);


module.exports.getHouseholds = (callback,limit) => { //callback function to run after the action completed
    Household.find(callback).limit(limit);
}

module.exports.getHouseholdById = (id, callback) => { 
    Household.findById(id, callback);
}

module.exports.addHousehold = (household, callback) => { 
    Household.create(household, callback);
}

/*
var fms = [
    {name: 'win', gender:'F', martialStatus:false, occupationType:'student', DOB: Date.parse("2000-01-01")},
    {name: 'bob', gender:'M', martialStatus:false, occupationType:'unemployed', DOB: Date.parse("1981-01-01")},
];

var arr = [{ housingType:'HDB', familyMembers: fms}];
Household.insertMany(arr, function(err) {
  if (err) throw err;

  console.log('Multiple HOUSE created!');

  // get all the subjects
  Household.find({}, function(err, hhs) {
        if(err) throw err;

        console.log(JSON.stringify(hhs, null, 4))
  });
});
*/
