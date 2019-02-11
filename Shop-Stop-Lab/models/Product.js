const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const PRODUCT_SCHEMA = MONGOOSE.Schema({
    name: { type: STRING, required: true },
    description: { type: STRING, required: true },
    price: {
        type: NUMBER,
        min: 0,
        max: NUMBER.MAX_VALUE,
        default: 0
    },
    image: { type: STRING },
    creator: { type: OBJECT_ID, ref: 'User', required: true },
    buyer: { type: OBJECT_ID, ref: 'User' },
    category: { type: OBJECT_ID, ref: 'Category', required: true }
});

const PRODUCT = MONGOOSE.model('Product', PRODUCT_SCHEMA);

module.exports = PRODUCT;