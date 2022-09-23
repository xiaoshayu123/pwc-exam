

export interface userSchema{
  username? : String,
password?: String,
realname?:String,
phone?:String,
description?:String,
followers?:Array<userSchema>
}