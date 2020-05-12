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
    housingType: {
        type: String,
        required: true
    },
    familyMembers: [familyMembersSchema] // not required
});

// Allows model to be used in other files
var Household = module.exports = mongoose.model("Household", householdSchema);

module.exports.getHouseholds = (callback,limit) => { //callback function to run after the action completed
    Household.find(callback).limit(limit);
}

module.exports.getHouseholdById = (id, callback) => { 
    Household.findById(id, callback);
}

module.exports.getTEST = (callback, limit) => { //test function
    Household.find(
        {housingType:{$eq:"HDB"}},
        callback
    ).limit(limit);
}

module.exports.getAggTEST = (callback) => { //test function
    Household.aggregate([
        { $match : { housingType : "HDB" } }
    ]).exec(callback);

}

module.exports.getFamilyMembersByHouseId = (id, callback) => { 
    Household.findById(id, callback).select("familyMembers");
}

module.exports.addFamilyMembersByHouseId = (id, familyMember, callback) => { 

    Household.findByIdAndUpdate(
        id,
        {$push: {"familyMembers": familyMember}},
        {safe: true, upsert: true, new : true},
        callback
    );
}

module.exports.addHousehold = (household, callback) => { 
    Household.create(household, callback);
}

module.exports.testAgg = (callback) => { //test function
    Household.aggregate([
        {
         $addFields: {
           householdIncome: {$sum : "$familyMembers.annualIncome"},
           numberFM: { $cond: { if: { $isArray: "$familyMembers" }, then: { $size: "$familyMembers" }, else: "NA"} }
         }
       }
        ,{$unwind:"$familyMembers"}
       ,{
         $addFields: {
    
            "familyMembers.age": {
               $let: {
                   vars: {
                      diff: {$subtract: [ new Date(), "$familyMembers.DOB" ] },
                   },
                   in: { $divide: [ "$$diff", (365 * 24*60*60*1000) ] }
                }
           }
    
         }
       }
    ,{ $match: { $and: [ { householdIncome: { $lt: 1100 }}, { "familyMembers.age": { $gt: 20 } } ] } }

   
   ,{
     $group:{
       _id: "$_id",
       householdIncome : { $first: '$householdIncome' },
       numberFM: {$first:'$numberFM'} ,
       qualify: 
       //{$mergeObjects: "$familyMembers" }   
       {$push: {"FM": "$familyMembers"}}
     }
   }
   
       
    ]).exec(callback);
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
