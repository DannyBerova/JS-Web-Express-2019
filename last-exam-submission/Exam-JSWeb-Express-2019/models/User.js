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
userSchema.path('firstName').validate(function () {
    return this.firstName.length >= 3 && this.firstName.length <= 30;
}, 'must be between 3 and 30 symbols!');
userSchema.path('lastName').validate(function () {
    return this.lastName.length >= 3 && this.lastName.length <= 30;
}, 'must be between 3 and 30 symbols!');
userSchema.path('imageUrl').validate(function () {
    return this.imageUrl.startsWith('http');
}, 'must start with http!');

const User = mongoose.model('User', userSchema);

//if email in use, don't forget to change it
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
