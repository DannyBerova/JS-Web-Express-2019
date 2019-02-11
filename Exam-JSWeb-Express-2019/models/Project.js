const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentSchema = new Schema({
    name: {type: Schema.Types.String, required: true, unique: true},
    description: {type: Schema.Types.String, required: true,},
    team: {type: Schema.Types.ObjectId, ref: 'Team'}
});

userSchema.path('name').validate(function () {
    return this.name.length >= 3 && this.name.length <= 30;
}, 'Name must be between 3 and 30 symbols!');
userSchema.path('description').validate(function () {
    return this.description.length >= 3 && this.description.length <= 50;
}, 'Description must be between 3 and 50 symbols!');

const Rent = mongoose.model('Rent', rentSchema);
module.exports = Rent;