const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    operator : { type: String, required: true },
    value : { type: String, required: true },
    records : {type: String, required: true},
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Transac_record', schema);