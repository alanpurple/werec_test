const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const PosDataSchema = new Schema({
    DealId: { type: Number, ref: 'DealW2v' },
    UserId: Number,
    WepickRank: Number,
    TransDate: String,
    Label: Number
}, { collection: 'posdata' });

module.exports = require('../connection').model('PosData', PosDataSchema);