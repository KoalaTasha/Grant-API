var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var householdSchema = new Schema({
    housingType: String
});

var Household = module.exports = mongoose.model("Household", householdSchema);

//
module.exports.getHousehold = function(callback,limit){
    Household.find(callback).limit(limit);
}


// var arr = [{ housingType:'HDB'}];
// Household.insertMany(arr, function(err) {
//   if (err) throw err;

//   console.log('Multiple HOUSE created!');

//   // get all the subjects
//   Household.find({}, function(err, hhs) {
//         if(err) throw err;

//         console.log(JSON.stringify(hhs, null, 4))
//   });
// });

