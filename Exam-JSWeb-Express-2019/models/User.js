const mongoose = require('mongoose');
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.String, required: true, unique: true },
    hashedPass: { type: mongoose.Schema.Types.String, required: true },
    firstName: { type: mongoose.Schema.Types.String, required: true  },
    lastName: { type: mongoose.Schema.Types.String, required: true  },
    imageUrl: { type: mongoose.Schema.Types.String, default: 'https://cdn.patchcdn.com/assets/layout/contribute/user-default.png' },
    salt: { type: mongoose.Schema.Types.String, required: true },
    roles: [{ type: mongoose.Schema.Types.String }],
    //rents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Rent'}],
    teams:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Team'}]
});


userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

userSchema.path('username').validate(function () {
    return this.username.length >= 3 && this.username.length <= 30;
}, 'Username must be between 3 and 30 symbols!');

//other validate examples
// cubeSchema.path('name').validate(function () {
//     return this.name.length >= 3 && this.name.length <= 15;
// }, 'Name must be between 3 and 15 symbols!');
// cubeSchema.path('description').validate(function () {
//     return this.description.length >= 20 && this.description.length <= 300;
// }, 'Description must be between 20 and 300 symbols!');
// cubeSchema.path('imageUrl').validate(function () {
//     return this.imageUrl.startsWith('http') && (this.imageUrl.endsWith('.jpg') || his.imageUrl.endsWith('.png'));
// }, 'Image URL must start with http and end with .jpg or .png!');
// cubeSchema.path('difficulty').validate(function () {
//     return this.difficulty >= 1 && this.difficulty <= 6;
// }, 'Difficulty should be between 1 and 7!');

const User = mongoose.model('User', userSchema);

// TODO: Create an admin at initialization here
User.seedAdminUser = async () => {
    try {
        let users = await User.find();
        if (users.length > 0) {
            return;
        }

        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, "Admin");
        return User.create({
            username: 'Admin',
            salt,
            hashedPass,
            firstName: 'Danny',
            lastName: 'Berova',
            roles: ['Admin']
        })
    } catch (e) {
        console.log(e);
    }
}; 
module.exports = User;
