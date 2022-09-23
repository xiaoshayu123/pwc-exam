import * as Koa from "koa";                     
import * as koaBody from "koa-body";            
const App = new Koa();
import router from "./routes/user";
const session=require('koa-generic-session')
const redisStore=require('koa-redis')
const json=require('koa-json')
const cors = require('koa2-cors');

App.use(json())
App.use(koaBody({
  multipart: true,
}));

App.use(cors({
  origin:"http://localhost:8080",
  maxAge: 2592000,
  // 必要配置
  credentials: true
}))

App.keys=['Wjiol_877776#']
App.use(session({
  //配置cookie
  cookie:{
    path:'/',
    httpOnly:true,
    maxAge:24*60*60*1000
  },
  //配置redis
  store:redisStore({
    all:'127.0.0.1:6379'//写死本地server
  })
}))

App.use(router.routes())
App.on("error", (err, ctx) => {
  console.log(`error`, err, ctx);
})

App.listen(3000, () => {
  console.log("服务器启动完成:");
})
