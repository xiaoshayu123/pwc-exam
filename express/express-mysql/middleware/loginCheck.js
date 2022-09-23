const {ErrorModel}=require('../model/resModel')
const loginCheck=(req,res,next)=>{
    if(!req.session.username){
        res.json(
            new ErrorModel('未登录,没有权限操作')
        )
        return ;
    }
    next()
}

module.exports=loginCheck