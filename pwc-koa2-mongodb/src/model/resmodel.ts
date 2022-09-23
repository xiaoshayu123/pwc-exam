class BaseModel{
public  message:String
public  data:Object
public errno:number
    constructor(data:object,message:string)
    {
        if(typeof data==='string')
        {
            this.message=data
            data=null
            message=null
        }
        if(data)
        {
            this.data=data
        }
        if(message)
        {
            this.message=message
        }
    }
    } 
    class SuccessModel extends BaseModel{
            constructor(data:object,message:string)
            {
                super(data,message)
                this.errno=0
            }
    }
    class ErrorModel extends BaseModel{
        constructor(data:object,message:string)
        {
            super(data,message)
            this.errno=-1
        }
    }
    
 export {
   SuccessModel,
   ErrorModel
 }