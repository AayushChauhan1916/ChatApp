const mongoose = require("mongoose");
const User = require("./user")

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    text:{
        type:String,
        default:""
    },
    imageUrl:{
        type:String,
        default:""
    },
    videoUrl:{
        type:String,
        default:""
    },
    sender:{
        type:mongoose.Schema.ObjectId,
        ref:User,
        required:true
    },
    receiver:{
        type:mongoose.Schema.ObjectId,
        ref:User,
        required:true
    },
    seen:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
}
)

const Message = mongoose.model("Message",messageSchema);

const conversationSchema = new Schema({
    sender:{
        type:mongoose.Schema.ObjectId,
        ref:User,
        required:true
    },
    receiver:{
        type:mongoose.Schema.ObjectId,
        ref:User,
        required:true
    },
    message:[
        {
            type:mongoose.Schema.ObjectId,
            ref:Message,
        }     
    ]
},{
    timestamps:true
})

const Conversation = mongoose.model("Conversation",conversationSchema);

module.exports = {
    Conversation,
    Message
}

