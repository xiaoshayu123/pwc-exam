const {exec,escape}=require('../db/mysql')
const xss=require('xss')
const {genPassword}=require('../utils/cryp')
const userLoginByName=(Username,Password)=>{
    console.log(genPassword(123456));
    let username=escape(Username)
    let password=escape(genPassword(Password))
   const sql=`select * from users where username=${username} and password= ${password}`
   return exec(sql).then(res=>{
        return res[0]||{}
   })
}
const userLoginByPhone=(Phone,Username)=>{
    let phone=escape(Phone)
    let username=escape(Username)
    const sql=`select * from users where phone=${phone}`
    return exec(sql).then(res=>{
        return res[0]||{}
   })
}
const userLoginByGithub=(Username)=>{
    let username=escape(Username)
    const sql=`select * from users where username=${username}`
    return exec(sql).then(res=>{
        return res[0]||{}
   })
}
const hasUser=(Username)=>{
    let username=escape(Username)
    const sql=`select username, realname from users where username=${username}`
    return exec(sql).then(res=>{
        return res[0]||{}
    })
}
const createNewUser=(data)=>{
    let username=escape(data.username)
    let realname=escape(data.realname)
    let password=escape(genPassword(data.password))
    let phone=escape(data.phone)
    let description=xss(escape(data.description))
    const sql=`insert into users values(${username},${realname},${password},${phone},${description})`
    return exec(sql).then(res=>{
        return res;
    })
}
const getUserInfo=(Username)=>{
    let username=escape(Username);
    const sql=`select * from users where username=${username}`
    return exec(sql).then(res=>{
        return res[0]||{}
    })
}
const getUserAll=()=>{
    const sql=`select * from users`
    return exec(sql).then(res=>{
        return res||[]
    })
}
const getFollowers=(Username)=>{
    let username=escape(Username)
    const sql=`select * from followers where followusername=${username}`
    return exec(sql).then(res=>{
        return res||[]
    })
}
const addNewFollower=(data)=>{
    let followusername=escape(data.followusername);
    let realname=escape(data.realname);
    let phone=escape(data.phone);
    let description=escape(data.description);
    let username=escape(data.username);
    const sql=`insert into  followers(followusername,realname,phone,description,username) values(${followusername},${realname},${phone},${description},${username})`
    return exec(sql).then(res=>{
        return res;
    })
}


module.exports={
    userLoginByName,
    userLoginByPhone,
    hasUser,
    createNewUser,
    getUserInfo,
    getUserAll,
    getFollowers,
    addNewFollower,
    userLoginByGithub
}

