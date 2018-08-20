const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const DealW2vSchema = new Schema({
    _id: Number,
    words: [String],
    vectorizedWords: {
        type: [Number],
        validate: {
            validator: v => v.length == 100
        }
    },
    title: String,
    category1: { type: Number, ref: 'Category1' },
    category2: { type: Number, ref: 'Category2' }
}, { collection: 'dealw2v' });

module.exports = require('../connection').model('DealW2v', DealW2vSchema);