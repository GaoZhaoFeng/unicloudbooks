const appId = 'wxa28c29ff839ef39c';
const appSecret = 'd559524c74718f6c8ebf615cc43289b8';


const jwt = require('jsonwebtoken');

//用openid生成token
function getToken (openid) {
	return jwt.sign({openid:openid},appSecret,{expiresIn:60*60*24});
}
//用token 获取token
function verifyToken (token) {
	return jwt.verify(token,appSecret)
}

module.exports = {
	appId:appId,
	appSecret:appSecret,
	getToken:getToken,
	verifyToken:verifyToken
}