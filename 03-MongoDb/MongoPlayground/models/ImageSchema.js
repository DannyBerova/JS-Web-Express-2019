const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: { type: Schema.Types.String, required: true },
    title: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String },
    creationDate: { type: Schema.Types.Date, default: Date.now },
    tags: [ { type: Schema.Types.ObjectId, ref: 'Tag' } ]
});

module.exports = mongoose.model('Image', imageSchema);