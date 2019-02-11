const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentSchema = new Schema({
    name: {type: Schema.Types.String, required: true, unique: true},
    projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
    members: [{type: Schema.Types.ObjectId, ref: 'User'}],
});

userSchema.path('name').validate(function () {
    return this.name.length >= 3 && this.name.length <= 30;
}, 'Name must be between 3 and 30 symbols!');

const Rent = mongoose.model('Rent', rentSchema);
module.exports = Rent;