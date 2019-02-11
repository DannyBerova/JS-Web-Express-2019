const MONGOOSE = require('mongoose');
const ROLE = MONGOOSE.model('Role');
const ENCRYPTION = require('../utilities/encryption');
const STRING = MONGOOSE.Schema.Types.String;
const NUMBER = MONGOOSE.Schema.Types.Number;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;
const PROPERTY_IS_REQUIRED = '{0} is required.';

const USER_SCHEMA = MONGOOSE.Schema({
    username: {
        type: STRING,
        required: PROPERTY_IS_REQUIRED.replace('{0}', 'Username'),
        unique: true
    },
    password: {
        type: STRING,
        required: PROPERTY_IS_REQUIRED.replace('{0}', 'Password')
    },
    salt: {
        type: STRING,
        required: true
    },
    firstName: {
        type: STRING,
        required: PROPERTY_IS_REQUIRED.replace('{0}', 'First name')
    },
    lastName: {
        type: STRING,
        required: PROPERTY_IS_REQUIRED.replace('{0}', 'Last name')
    },
    age: {
        type: NUMBER,
        min: [0, 'Age must be between 0 and 120'],
        max: [120, 'Age must be between 0 and 120']
    },
    gender: {
        type: STRING,
        enum: {
            values: ['Male', 'Female'],
            message: 'Gender should be either "Male" or "Female".'
        }
    },
    roles: [{
        type: OBJECT_ID, ref: 'Role'
    }],
    boughtProducts: [{
        type: OBJECT_ID, ref: 'Product'
    }],
    createdProducts: [{
        type: OBJECT_ID, ref: 'Product'
    }],
    createdCategories: [{
        type: OBJECT_ID, ref: 'Category'
    }]
});

USER_SCHEMA.method({
    authenticate: function (password) {
        let hashedPassword = ENCRYPTION.generateHashedPassword(this.salt, password);

        if (hashedPassword === this.password) {
            return true;
        }

        return false;
    }
});

const USER = MONGOOSE.model('User', USER_SCHEMA);

module.exports = USER;

module.exports.init = () => {
    USER.findOne({ username: 'admin' }).then((admin) => {
        if (admin) {
            return;
        }

        ROLE.findOne({ name: 'Admin' }).then((role) => {
            let salt = ENCRYPTION.generateSalt();
            let passwordHash = ENCRYPTION.generateHashedPassword(salt, 'admin123456');
            let adminUser = {
                username: 'admin',
                firstName: 'Admin',
                lastName: 'Adminov',
                salt: salt,
                password: passwordHash,
                age: 28,
                gender: 'Male',
                roles: [role._id]
            };

            USER.create(adminUser).then((user) => {
                role.users.push(user._id);
                role.save();
            });
        });
    });
};