const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentSchema = new Schema({
    days: {type: Schema.Types.Number, required: true},
    car: {type: Schema.Types.ObjectId, ref: 'Car', required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
});

rentSchema.path('days').validate(function () {
    return this.days >= 1;
}, 'Days should be positive number more than 0!');

const Rent = mongoose.model('Rent', rentSchema);
module.exports = Rent;