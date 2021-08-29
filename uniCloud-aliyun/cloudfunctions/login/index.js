'use strict';

const db = uniCloud.database().collection('users');
const { appId,appSecret,getToken } = require('wx-common');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const  { code } = event;
	const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
	const res = await uniCloud.httpclient.request(url,
		{
			dataType:'json'
		}
	)
	const openid = res.data.openid;
	const token = getToken(openid);
	let dbRes = await db.where({
		openid:openid
	}).get()
	let userInfo
	if(dbRes.affectedDocs<=0){
		 userInfo = {
			avatarUrl:'',
			nickname:'微信用户',
			openid,
		}
		await db.add(userInfo)
	}else{
		userInfo = dbRes.data[0];
	}
	delete userInfo['openid']
	userInfo['token'] = token
	//返回数据给客户端
	return userInfo
};
