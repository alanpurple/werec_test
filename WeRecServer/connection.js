const mongoose = require('./set-mongoose');
module.exports = mongoose.createConnection('mongodb://10.102.61.251:27017/wprec', { useNewUrlParser: true });