'use strict';
const { verifyToken } = require('wx-common');
const db = uniCloud.database().collection('users');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const { userInfo,token } = event;
	const payload = verifyToken(token);
	
	const updateInfo = {
		nickname:userInfo.nickName,
		avatarUrl:userInfo.avatarUrl,
		gender:userInfo.gender,
		city:userInfo.city,
		province:userInfo.province,
		country:userInfo.country
	}
	const res = await db.where({
		openid:payload.openid
	}).update(updateInfo)
	//返回数据给客户端
	return res
};
