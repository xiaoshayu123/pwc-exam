
import mongoose from 'mongoose'
const url="mongodb://localhost:27017"
const dbName='pwc'

mongoose.connect(`${url}/${dbName}`)

const db=mongoose.connection

db.on('error',(err: any)=>{
    console.error(err)
})

export default mongoose