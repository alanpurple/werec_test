const mongoose = require('./set-mongoose');
module.exports = mongoose.createConnection('mongodb://localhost/WeRecTestDB');