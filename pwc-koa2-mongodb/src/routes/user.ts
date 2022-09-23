const { SuccessModel, ErrorModel } = require('../model/resModel');
const Core = require('@alicloud/pop-core');
const router = require('koa-router')()
import {userLoginByName,userLoginByGithub,addNewFollower,userLoginByPhone,createNewUser,hasUser,getUserAll}from '../controller/user'
router.prefix('/api/user')
import {ParameterizedContext} from 'koa'
import axios from 'axios'
import { userSchema } from 'base';
router.get('/login',  async function(ctx:ParameterizedContext, next: Function) {
    const {type}=ctx.request.query
    if(type==='username')
    {
      const {username,password}=ctx.request.query;
      const result=await userLoginByName(username as string,password as string)
      console.log(result);
      if(result)
      {
        ctx.session.username=(result as userSchema).username
        ctx.body=new SuccessModel(result,"登陆成功")
      }
    }
      else
      {
        const {phone,code}=ctx.request.query;
        if(ctx.session.phone==code)
        {
          console.log(ctx.session);
            const userDetail=await userLoginByPhone(phone as string)
            if(userDetail.username)
            {
                ctx.session.username=userDetail.username
                ctx.body=new SuccessModel(userDetail,"登陆成功")
            }
        }else{
            ctx.body=new ErrorModel("验证码错误")
        }
      }
});
router.get('/sendSmsCodeToUser',async function(ctx:ParameterizedContext,next:Function){
  const { phone } = ctx.request.query
  let CODE = Math.random().toString().slice(-6)
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
  ctx.session.phone=CODE
  console.log(ctx.session.phone);
  // ctx.body=new SuccessModel({code:CODE},"验证码发送成功");
  //测试的时候将后面的内容注掉就可以
  const result=client.request('SendSms', params, requestOption)
  if(result.Code&&result.Code==='OK'){
    ctx.session.phone=CODE
    ctx.body=new SuccessModel({code:CODE},"验证码发送成功")
  }
  else
  {
    ctx.body=new ErrorModel("验证码发送失败，请稍后再试")
  }
})
router.post('/register',async function(ctx:ParameterizedContext,next:Function){
  const {username,code}=ctx.request.body
  if(!ctx.session.phone){ctx.body=new ErrorModel('请输入验证码');return}
  console.log(ctx.session)
  if(ctx.session.phone!=code){ctx.body=new ErrorModel("验证码错误");return }
  const result=await hasUser(username as string)
  console.log(result);
  if(result&&result.username)
    {
      ctx.body=new ErrorModel("用户名已被占用");
    }
    const userDetail=await createNewUser(ctx.request.body)
    if(userDetail){
      ctx.body=new SuccessModel(userDetail,"注册成功")
    }
})
router.get('/auth/github',async function(ctx:ParameterizedContext,next:Function) {
  let dataStr = (new Date()).valueOf()
  // 重定向到认证接口,并配置参数
  // https://github.com/login/oauth/authorize?client_id=xxxxx&state=xxx&redirect_uri=xxxx
  let path = 'https://github.com/login/oauth/authorize'
  path += '?client_id=' + "f3dfd4eb08f1433cb78e"
  // path += '&scope=' + OAuthConfig.GITHUB_CLIENT_SCOPE
  path += '&state=' + dataStr
  ctx.body=new SuccessModel(path,"请访问");
})
router.get('/auth/github/getData',async function(ctx:ParameterizedContext,next:Function){
  const accessToken = ctx.request.query.token
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
  if(hasuser)
  {
    ctx.session.username=(hasuser as userSchema).username;
    const userdata= await userLoginByGithub(hasuser.username)
    console.log(ctx.session.username);
    ctx.body=new SuccessModel(userdata,"登陆成功");
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
      ctx.session.username=result.data.login;
      const userdata= await userLoginByGithub(result.data.login)
      ctx.body=new SuccessModel(userdata,"登陆成功");
    }

  }
})
router.get('/auth/github/callback',async function(ctx:ParameterizedContext,next:Function){
  const requestToken =ctx.request.query.code
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
  ctx.redirect(`http://localhost:8080/#/github?access_token=${accessToken}`)
})
router.get('/getInfo',async function (ctx:ParameterizedContext,next:Function) {
  const {username}=ctx.request.query
  const result=await hasUser(username as string)
  if(result){
    ctx.body=new SuccessModel(result,"获取信息成功");
  }
  else{
    ctx.body=new ErrorModel('获取用户信息失败');
  }
})
router.get('/getAllInfo',async function(ctx:ParameterizedContext,next:Function){
  const result=await getUserAll();
  console.log(result);
  if(result)ctx.body=new SuccessModel({data:result,count:result.length},"获取全部用户信息成功");
  else
  {
     ctx.body=new ErrorModel("获取信息失败");
  }
   
  
})
router.post('/addFollower',async function (ctx:ParameterizedContext,next:Function) {
  const username=ctx.session.username;
  const result=await addNewFollower(ctx.request.body,username);
  if(result)
  {
    ctx.body=new SuccessModel("添加关注者成功");
  }
  else
  {
    ctx.body=new ErrorModel("添加关注者失败");
  }
})
export default router
