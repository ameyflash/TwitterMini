var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = new Schema({
    uname: String,
    tweet: String
});

module.exports = mongoose.model('Tweet', TweetSchema);