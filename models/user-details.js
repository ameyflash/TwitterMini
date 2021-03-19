var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var detailsSchema = new Schema({
    num: Number,
    age: Number,
    dob: String,
    gender: String
});

module.exports = mongoose.model('detail', detailsSchema);