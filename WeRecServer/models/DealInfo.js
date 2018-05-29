const mongoose = require('../set-mongoose');
const Schema = mongoose.Schema;

const DealInfoSchema = new Schema({
    _id: Number,
    _class: String,
    did: Schema.Types.ObjectId,
    dgid: Number,
    sst: Date,
    set: Date,
    pe: Number,
    po: Number,
    pot: Number,
    ps: Number,
    st: Number,
    ef: Number,
    lttd: String,
    lgtd: String,
    ci: String,
    mn: String,
    ls: String,
    sn: String,
    on: String,
    dc: String,
    t: Object
});