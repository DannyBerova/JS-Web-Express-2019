const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    email: { type: Schema.Types.String, required: true, unique: true },
    hashedPass: { type: Schema.Types.String, required: true },
    salt: { type: Schema.Types.String, required: true },
    roles: [{ type: Schema.Types.String }],
    edits: [ { type: Schema.Types.ObjectId, ref: 'Edit' } ]
});

userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async () => {
    try {
        let users = await User.find();
        if (users.length > 0) return;
        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, '123');
        return User.create({
            email: 'admin@abv.bg',
            salt,
            hashedPass,
            roles: ['Admin']
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = User;
