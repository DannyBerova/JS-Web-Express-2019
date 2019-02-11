const mongoose = require('mongoose');
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.String, required: true, unique: true },
    hashedPass: { type: mongoose.Schema.Types.String, required: true },
    firstName: { type: mongoose.Schema.Types.String },
    lastName: { type: mongoose.Schema.Types.String },
    salt: { type: mongoose.Schema.Types.String, required: true },
    roles: [{ type: mongoose.Schema.Types.String }],
    rents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Rent'}]
});


userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

userSchema.path('username').validate(function () {
    return this.username.length >= 3 && this.username.length <= 30;
}, 'Username must be between 3 and 30 symbols!');

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
