const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    roomId:{
        type:String,
        
        default:null
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
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
    