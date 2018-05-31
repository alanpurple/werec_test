const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const PerUserSchema = new Schema({
    userId: { type: Number, ref: 'MemberInfo' },
    history: [{ type: Number, ref: 'DealInfo' }]
}, { _id: false });

const HistorySchema = new Schema({
    _id: Number,
    day: Date,
    data: [PerUserSchema]
});

module.exports = require('../connection').model('History', HistorySchema);