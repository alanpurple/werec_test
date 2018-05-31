const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const SubSchema1 = new Schema({
    did: { type: Number, ref: 'DealInfo' },
    s: String
}, { _id: false });

const SubSchema2 = new Schema({
    did: { type: Number, ref: 'DealInfo' },
    oid: Number,
    cnt: Number
}, { _id: false });

MemberActionInfoSchema = new Schema({
    mid: Number,
    day: String,
    ft: {
        type: {
            s: [String],
            c: [SubSchema1],
            o: [SubSchema2]
        }
    }
});

module.exports = require('../connection-praha')
    .model('MemberActionInfo', MemberActionInfoSchema);