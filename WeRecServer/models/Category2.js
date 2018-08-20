const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const Category2Schema = new Schema({
    _id: Number,
    name: { type: String, default: '' }
});

module.exports = require('../connection').model('Category2', Category2Schema);