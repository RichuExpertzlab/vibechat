const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    roomId:{
        type:String,
        required:true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:['text','image'],
        default:'text'
    }
},{timestamps:true});
module.exports = mongoose.model('Message', MessageSchema);
    