const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name : { type: String, unique: true, required: true },
    region : { type: String, required: true },
    departement: { type: String, required: true },
    arrondissement: { type: String, required: true },
    type: { type: String, required: true },
    latitude : { type: String, required: true},
    longitude : { type: String, required: true},
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('School', schema);