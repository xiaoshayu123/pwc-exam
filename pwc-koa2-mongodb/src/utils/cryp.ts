
import * as crypto from 'crypto'

//密匙
const SECRET_KEY='Wjiol_8776#'

//使用MD5加密

function md5(content:string){
    let md5=crypto.createHash('md5')
    return md5.update(content).digest('hex')
}


function genPassword(password:string)
{
    const str=`password=${password}&key=${SECRET_KEY}`

    return md5(str)
}

export default genPassword
