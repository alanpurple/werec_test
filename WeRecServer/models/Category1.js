const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const Category1Schema = new Schema({
    _id: Number,
    name: { type: String, default: '' }
});

module.exports = require('../connection').model('Category1', Category1Schema);