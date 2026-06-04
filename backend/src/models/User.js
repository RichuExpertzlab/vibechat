const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    avatar: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum:['online','offline'],
        default: "offline"
    }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);