const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    username : String,
    pwd : String
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hash(password,bcrypt.genSaltSync(8),null);
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compare(password, this.pwd);
}

module.exports = mongoose.model('users',userSchema);