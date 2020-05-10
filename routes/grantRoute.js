
var express = require("express");

var router = express.Router();


router.get('/', (req, res) => {
// get all the grants + their ids
    res.send('all grants');
});


router.get('/:_id', (req, res) => {
// using grant id, find all families that qualify
    res.send('families that qualify');
});


module.exports = router;