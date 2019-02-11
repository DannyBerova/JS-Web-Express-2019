const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const CATEGORY_SCHEMA = MONGOOSE.Schema({
    name: { type: STRING, required: true, unique: true },
    creator: { type: OBJECT_ID, ref: 'User', required: true },
    products: [{ type: OBJECT_ID, ref: 'Product' }]
});

const CATEGORY = MONGOOSE.model('Category', CATEGORY_SCHEMA);

module.exports = CATEGORY;