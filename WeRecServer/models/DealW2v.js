const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const DealW2vSchema = new Schema({
    _id: Number,
    words: [String],
    vectorizedWords: {
        type: [Number],
        validate: {
            validator: v => len(v) == 100
        }
    }
}, { collection: 'dealw2v' });

module.exports = require('../connection').model('DealW2v', DealW2vSchema);