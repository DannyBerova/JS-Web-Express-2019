const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: { type: Schema.Types.String, required: true },
    images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    creationDate: { type: Schema.Types.Date, default: Date.now },
    nameToLower: { type: Schema.Types.String, get: nameToLower }
}, {
    toObject : {getters: true},
    toJSON : {getters: true}
});

function nameToLower() {
    return this.name.toLowerCase();
}

module.exports = mongoose.model('Tag', tagSchema);