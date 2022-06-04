const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true
	},
    password: {
        type: String,
        required: true
    },
    isEnabled: {
        type: Boolean,
        default: true
    },

    userRole: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;