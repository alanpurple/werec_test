const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const DealInfoSchema = new Schema({
    _id: String,
    mn: String,
    did: Number,
    t: {
        type: {
            tn1: String,
            ti1: Number,
            tn2: String,
            ti2: Number
        }
    }
});

module.exports = require('../connection-praha')
    .model('DealInfo', DealInfoSchema);