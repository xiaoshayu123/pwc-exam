var express = require('express');
var router = express.Router();
const {userLoginByPhone,userLoginByName,hasUser,createNewUser,getUserInfo,getUserAll,getFollowers,addNewFollower,userLoginByGithub}=require('../controler/user');
const {SuccessModel,ErrorModel}=require('../model/resModel')
const Core = require('@alicloud/pop-core');
const axios=require('axios')
const loginCheck=require('../middleware/loginCheck')
/* GET users listing. */
router.get('/login', async function(req, res, next) {
  const {type}=req.query
  console.log(req.query);
  if(type==='username')
  {
    const {username,password}=req.query;
    const result=userLoginByName(username,password)
    return result.then(ans=>{
      console.log(ans);
     if(ans.username)
     {
      req.session.username=username;
        res.json(new SuccessModel(ans,'登陆成功')) 
        return ;
     }
     res.json(new ErrorModel('登陆失败')) 
    })
  }
  else
  {
    const {phone,code}=req.query;
    console.log(req.session.phone);
    if(req.session.phone==code)
    {
          const userDetail=await userLoginByPhone(phone)
          console.log(userDetail);
          if(userDetail.username)
          {
            req.session.username=userDetail.username;
            res.json(new SuccessModel(userDetail,"登陆成功"))
          }
          else
          {
            res.json(new ErrorModel("手机号错误"))
          }
    }
    else
    {
      res.json(new ErrorModel("验证码输入错误"))
    }
  }
    
});
router.get('/sendSmsCodeToUser', function(req, res, next) {
  const { phone } = req.query
  CODE = Math.random().toString().slice(-6)
  var client = new Core({
    accessKeyId: 'LTAI5tCQBZcrkFEegimGGtem', // 自己申请短信的
    accessKeySecret: 'fxSyXJw02YW911zkTveV6vmTc2r38y', 
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  })
  var params = {
    "SignName": "阿里云短信测试",
    "TemplateCode": "SMS_154950909",
    "PhoneNumbers": phone,
    "TemplateParam": `{code: ${CODE}}`
  }
  var requestOption = {
    method: 'POST'
  }
  req.session.phone=CODE
  console.log(req.session.phone);
  // res.json(new SuccessModel({code:CODE},"验证码发送成功"))
  //测试的时候将后面的内容注掉就可以
  client.request('SendSms', params, requestOption).then((result) => {
    console.log(result);
      if(result.Code&&result.Code==='OK'){
        req.session[phone]={
          code:CODE
        }
        res.json(new SuccessModel({code:CODE},"验证码发送成功"))
      }
      else
      {
        res.json(new ErrorModel("验证码发送失败，请稍后再试"))
      }
    }, (ex) => {
      console.log(ex);
      res.json(new ErrorModel("验证码发送失败，请稍后再试"))
    })
});
router.post('/register',function(req, res, next){
  const {username,phone,code}=req.body
  if(!req.session.phone){res.json(new ErrorModel('请输入验证码'));return}
  console.log(req.session.phone)
  if(req.session.phone!=code){res.json(new ErrorModel("验证码错误"));return }
  const result=hasUser(username)
   result.then(ans=>{
    if(ans.username)
    {
      res.json(new ErrorModel("用户名已被占用"));
    }
    return ;
  }).then(result=>{
    return createNewUser(req.body).then(result=>{
      if(result)
      {
        res.json(new SuccessModel(result,"注册成功"))
      }
    })
  })
}),
router.get('/auth/github',function(req,res,next){
  let dataStr = (new Date()).valueOf()
  // 重定向到认证接口,并配置参数
  // https://github.com/login/oauth/authorize?client_id=xxxxx&state=xxx&redirect_uri=xxxx
  let path = 'https://github.com/login/oauth/authorize'
  path += '?client_id=' + "f3dfd4eb08f1433cb78e"
  // path += '&scope=' + OAuthConfig.GITHUB_CLIENT_SCOPE
  path += '&state=' + dataStr
  res.json(new SuccessModel(path,"请访问"));
})
router.get('/auth/github/getData',async function(req,res,next){
  const accessToken = req.query.token
  const result = await axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      accept: 'application/json',
      Authorization: `token ${accessToken}`
    }
  })
  console.log(result);
  const hasuser=await hasUser(result.data.login);
  if(hasuser.username)
  {
    req.session.username=hasuser.username;
    const userdata= await userLoginByGithub(hasuser.username)
    const followers=await getFollowers(result.data.username);
    userdata['followers']=followers;
    console.log(req.session.username);
    res.json(new SuccessModel(userdata,"登陆成功"));
  }
  else
  {
    const ans=createNewUser({
      username:result.data.login,
      realname:result.data.name,
      password:null,
      phone:null,
      description:result.data.bio
    })
    if(ans){
      const userDetail=hasUser(result.data.login);
      req.session.username=result.data.login;
      const userdata= await userLoginByGithub(hasuser.username)
      res.json(new SuccessModel(userdata,"登陆成功"));
    }

  }
})
router.get('/auth/github/callback',async function(req,res,next){
  const requestToken =req.query.code
  const tokenResponse = await axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token?' +
      `client_id=f3dfd4eb08f1433cb78e&` +
      `client_secret=dd04eb65461b2901f826d95bca27689f7656510e&` +
      `code=${requestToken}`,
    headers: {
      accept: 'application/json'
    }
  })
  const accessToken = tokenResponse.data.access_token
  res.redirect(`http://localhost:8080/#/github?access_token=${accessToken}`)
 
})
router.get('/getInfo',async function(req,res,next){
  const {username}=req.query
  const result=await getUserInfo(username)
  if(result.username){
    const followers=await getFollowers(username);
    result['followers']=followers;
    res.json(new SuccessModel(result,"获取信息成功"));
  }
  else{
    res.json(new ErrorModel('获取用户信息失败'));
  }
})
router.get('/getAllInfo',async function(req,res,next){
  const result=await getUserAll();
  if(result.length>0)
  {
    for(let i=0;i<result.length;i++)
    {
      let nowUser=result[i];
      let username=nowUser.username;
      const followers=await getFollowers(username);
      nowUser['followers']=followers;
    }
    res.json(new SuccessModel({data:result,count:result.length},"获取全部用户信息成功"));
  }
  else{
    res.json(new ErrorModel("获取信息失败"));
  }
})
router.post('/addFollower',loginCheck,async function(req,res,next){
  const username=req.session.username;
  req.body.followusername=username;
  const result=await addNewFollower(req.body);
  if(result)
  {
    res.json(new SuccessModel("添加关注者成功"));
  }
  else
  {
    res.json(new ErrorModel("添加关注者失败"));
  }
})

module.exports = router;
