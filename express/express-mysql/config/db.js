const env=process.env.NODE_ENV  //获取环境参数

let MYSQL_CONF;
let REDIS_CONF;
    MYSQL_CONF={
        host:'localhost',
        user:'root',
        password:'123',
        port:3306,
        database:'pwc_user'
    }
    REDIS_CONF={
        port:'6379',
        host:'127.0.0.1'
    }

module.exports={
    MYSQL_CONF,
    REDIS_CONF
}