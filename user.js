const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    username : String,
    pwd : String
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.pwd);
}

module.exports = mongoose.model('users',userSchema);