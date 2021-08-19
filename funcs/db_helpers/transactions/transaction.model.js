const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    operator : { type: String, unique: true, required: true },
    value : { type: String, required: true },
    schoolname : { type: String, required: true },
    schoolid : { type: Schema.Types.ObjectId, ref: 'School'},
    timestamp: { type: Date, required: true },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Transaction', schema);