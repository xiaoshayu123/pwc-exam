

import mongoose from '../mongodb'

const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    realname:String,
    phone:String,
    description:String,
    followers:Array
}, { timestamps: true })


const user=mongoose.model('users',userSchema)


export default user