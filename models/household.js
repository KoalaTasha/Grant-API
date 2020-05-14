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
        required: true,
        default: "unemployed"
    },
    DOB: {
        type: Date,
        required: true
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
    familyMembers: [familyMembersSchema] 
});

// Allows model to be used in other files
var Household = module.exports = mongoose.model("Household", householdSchema);

module.exports.getHouseholds = (callback,limit) => { //callback function to run after the action completed
    Household.find(callback).limit(limit);
}

module.exports.getHouseholdById = (id, callback) => { 
    Household.findById(id, callback);
}

module.exports.delHouseholdById = (id, callback) => { 
    var query = {_id: id};
    Household.deleteOne(query, callback);
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


module.exports.delFamilyMembersByHouseId = (id, FM_id, callback) => { 
    Household.updateOne(
        {_id: id},
        {$pull: {"familyMembers":{ _id:FM_id }}},
        { new : true},
        callback
    );
}

module.exports.addHousehold = (household, callback) => { 
    Household.create(household, callback);
}

module.exports.getEligibleByInput = (query, callback) => { //test function
    Household.aggregate([
        // ADD household income, num of FM(family members) 
        {
            $addFields: {
                householdIncome: {$sum : "$familyMembers.annualIncome"},
                numberFM: { $cond: { if: { $isArray: "$familyMembers" }, then: { $size: "$familyMembers" }, else: "NA"} }, //todo
                // if ppl in the spouse list are in the family list, it means there is a least one couple live tgt
                intersect: { $setIntersection: [ "$familyMembers.spouse", "$familyMembers.name" ] }
            }
        },
        // ADD if house has couple 
        {
            $addFields: {
                couple: { $cond: { if: { $ne: [ "$intersect", [] ] }, then: true, else: false} }
            }
        },
        // household without any FMs will be excluded from this point on
        {$unwind:"$familyMembers"},
        // ADD FM(family members) age relative to today 
        {
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
        },
        // matches based on input query
        { $match: { householdIncome: { $lt: query.hh_income_lt }} },
        { $match:  { "familyMembers.age": { $gt: query.fm_age_gt } }},
        { $match:  { "familyMembers.age": { $lt: query.fm_age_lt } }}, 
        { $match:  { housingType: query.house_type }}, 
        { $match:  { couple: query.has_couple }}, 
        // Present relevant infomation 
        {
            $group:{
                _id: "$_id",
                couple: { $first: '$couple' },
                housingType: { $first: '$housingType' },
                householdIncome : { $first: '$householdIncome' },
                numberFM: {$first:'$numberFM'} ,
                qualifyingFM: {$addToSet:"$familyMembers"}
            }
        }
   
    ]).exec(callback);
}
