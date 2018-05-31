const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const SubSchema1 = new Schema({
    lid: Number,
    ln1: String,
    ln2: String
}, { _id: false });

const SubSchema2 = new Schema({
    dvcid: String,
    dn: String,
    dot: Number,
    dv: String,
    av: String
});

const MemberInfoSchema = new Schema({
    mid: Number,
    s: Number,
    bq: Number,
    fl: [SubSchema1],
    g: Number,
    d: [SubSchema2]
});

module.exports = require('../connection-praha')
    .model('MemberInfo', MemberInfoSchema);