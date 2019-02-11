const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memeSchema = new mongoose.Schema({
    title: {
        type: Schema.Types.String,
        required: true
    },
    memeSrc: {
        type: Schema.Types.String,
        required: true
    },
    description: {
        type: Schema.Types.String
    },
    privacy: {
        type: Schema.Types.Boolean,
        required: true
    },
    dateStamp: {
        type: Schema.Types.Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Meme', memeSchema);