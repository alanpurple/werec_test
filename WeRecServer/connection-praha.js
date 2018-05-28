const mongoose = require('./set-mongoose');
const opts = { user: 'praha_read', pass: 'praha!@#' };
module.exports = mongoose.createConnection('35.190.239.204', 'praha', 27017, opts);