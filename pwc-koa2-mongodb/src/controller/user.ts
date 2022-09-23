
import user from '../db/modules/user'
import genPassword from '../utils/cryp';
import { userSchema } from '../types/base';
const xss=require('xss');
const userLoginByName=async (username:string,Password:string)=>{
    let password=genPassword(Password)
    const usert=await user.find({
        username,
        password
    })
    return usert[0]
}

const userLoginByPhone=async (phone:string)=>{
const usert=await user.find({
    phone
})
return usert[0]
}
const userLoginByGithub=async (username:string)=>{
    const result=await user.find({
        username
    })
    return result[0]
}
const hasUser=async (username:string)=>{
    const result=await user.find({
        username
    })
    return result[0]
}
const createNewUser=async (data:userSchema)=>{
    const newobj:userSchema={
        username:""
    }
    if(data.username)newobj.username=data.username
    if(data.realname)newobj.realname=data.realname
    if(data.phone)newobj.phone=data.phone
    if(data.description)newobj.description=xss(data.description)
    if(data.password)newobj.password=genPassword(data.password as string)
    const result=await user.create({
       ...newobj

    })
    if(!result)return {}
    return result
}
const getUserAll=async ()=>{
    const result=await user.find();
    return result;
}
const addNewFollower=async (data:userSchema,followerUser:string)=>{
    const result=await user.find({
        username:followerUser
    })
    if(result)
    {
        let ans=result[0];
        ans.followers.push(data);
        const anst=await user.findOneAndUpdate({
            username:followerUser
        },
        {
            followers:ans.followers
        })
        if(anst)
        {
            return anst;
        }
        return {}
    }
}
export  {
    userLoginByName,
    userLoginByPhone,
    userLoginByGithub,
    hasUser,
    createNewUser,
    getUserAll,
    addNewFollower
}

