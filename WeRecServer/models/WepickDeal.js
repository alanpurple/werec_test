const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const WepickDealSchema = new Schema({
    _id: String,
    cnt: { type: Number, required: true, default: 0 },
    deal: { type: Number, ref: 'DealW2v' }
}, { versionKey: false });

module.exports = require('../connection').model('WepickDeal', WepickDealSchema);