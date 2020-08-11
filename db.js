const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin:admin@cluster0.yjub4.mongodb.net/demoLogin?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
module.exports = db.collection('users');