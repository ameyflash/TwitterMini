var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    uname: {
        type: String,
        required: true,
        allowNull: false
      },
    eaddr: {
        type: String,
        required: true,
        allowNull: false,
        isEmail: true
      },
    pswd: {
        type: String,
        required: true,
        allowNull: false,
        len: [4, 10]
      }
});

module.exports = mongoose.model('User', UserSchema);