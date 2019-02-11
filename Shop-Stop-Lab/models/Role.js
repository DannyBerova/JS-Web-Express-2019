const MONGOOSE = require('mongoose');
const STRING = MONGOOSE.Schema.Types.String;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const ROLE_SCHEMA = MONGOOSE.Schema({
    name: { type: STRING, required: true, unique: true },
    users: [{ type: OBJECT_ID, ref: 'User' }]
});

const ROLE = MONGOOSE.model('Role', ROLE_SCHEMA);

module.exports = ROLE;

module.exports.init = () => {
    ROLE.findOne({ name: 'User' }).then((role) => {
        if (!role) {
            ROLE.create({ name: 'User' });
        }
    });

    ROLE.findOne({ name: 'Admin' }).then((role) => {
        if (!role) {
            ROLE.create({ name: 'Admin' });
        }
    });
};