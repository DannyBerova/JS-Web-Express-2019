const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    description: {
        type: Schema.Types.String,
        required: true,
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    }
});

projectSchema.path('name').validate(function () {
    return this.name.length >= 3 && this.name.length <= 30;
}, 'Name must be between 3 and 30 symbols!');
projectSchema.path('description').validate(function () {
    return this.description.length >= 3 && this.description.length <= 50;
}, 'Description must be between 3 and 50 symbols!');

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;