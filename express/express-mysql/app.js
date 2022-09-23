
var express = require('express');
var cookieParser = require('cookie-parser');//解析cookie
var logger = require('morgan');//日志相关的插件
var session=require('express-session')

var userRouter=require('./routes/user')
var redisStore=require('connect-redis')(session)
var redisClient=require('./db/redis')
var app = express();
const sessionStore=new redisStore(
  {
    client:redisClient
  }
)


app.use(logger('dev'))
app.use(express.json());//解析post请求中的data数据，解析的是json格式内容
app.use(express.urlencoded({ extended: false }));//解析post请求中的data数据，解析的是form格式数据
app.use(cookieParser());

//链接redis
//session初始化配置
app.use(session({
  secret:'Wjiol_877776#',
  cookie:{
    path:'/',//默认配置
    httpOnly:true,//默认配置
    maxAge:24*60*60*1000,
  },
  store:sessionStore
}));
app.all("*",function(req,res,next){
  // 设置允许跨域的域名,*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin','http://localhost:8080');
  // 允许的header类型
  res.header('Access-Control-Allow-Headers','content-type');
  // 跨域允许的请求方式
  res.header('Access-Control-Allow-Methods','DELETE,PUT,POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials','true')
  if(req.method.toLowerCase() == 'options')
      res.send(200); // 让options 尝试请求快速结束
  else
      next();
})

//注册路由
app.use('/api/user',userRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.json({
    data:'404 not found'
  })
});


//程序出错会抛错
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
