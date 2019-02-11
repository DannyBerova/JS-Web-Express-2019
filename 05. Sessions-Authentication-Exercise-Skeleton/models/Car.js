const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    model: {type: Schema.Types.String, required: true},
    image: {type: Schema.Types.String, required: true},
    pricePerDay: {type: Schema.Types.Number, required: true},
    isRented: {type: Schema.Types.Boolean, default: false},
});

carSchema.path('model').validate(function () {
    return this.model.length >= 3 && this.model.length <= 30;
}, 'Model name must be between 3 and 30 symbols!');
carSchema.path('image').validate(function () {
    return this.image.startsWith('http');
}, 'Image URL must start with http and be valid url');
carSchema.path('pricePerDay').validate(function () {
    return this.pricePerDay >= 1;
}, 'Price Per Day should be positive number!');

const Car = mongoose.model('Car', carSchema);
module.exports = Car;