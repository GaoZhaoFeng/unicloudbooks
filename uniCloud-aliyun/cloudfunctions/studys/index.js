'use strict';
const { verifyToken } = require('wx-common');
const db = uniCloud.database().collection('studys');
const hander = uniCloud.database();
const dbCmd = uniCloud.database().command;
let dbRes;
exports.main = async (event, context) => {
	const { token,action,data } = event;
	const { openid } = verifyToken(token);
	switch(action){
		case 'add':
			dbRes = await db.add({
				ownerId:openid,
				name:data.name,
				address:data.address,
				geopoint:new hander.Geo.Point(data.longitude,data.latitude),
				totalStudys:0
			});
			break;
		case 'update':
		    const _id = data._id;
			delete data._id;
		    dbRes = await db.where({
				ownerId:dbCmd.eq(openid),
				_id
			}).update(data);
			break;
		case 'delete':
			dbRes = await db.where({
				_id:data._id,
				ownerId:dbCmd.eq(openid)
			}).remove();
			break;
		case 'get':
			let page = 1;
			let pageSize = 10;
			let skip;
			if(data){
				page = data.page;
				pageSize = data.pageSize;
			}
			skip = (page-1)*pageSize
			dbRes = await db.aggregate().lookup({
				from:'users',
				localField:'ownerId',
				foreignField:'openid',
				as:'userInfo'
			}).skip(skip).limit(pageSize).end();
			dbRes.data.forEach(row=>{
				delete row.ownerId;
				row.userInfo.forEach(item => delete item.openid)
				row.userInfo = row.userInfo[0]
			})
			break;
		case 'getList':
			dbRes = await db.where({
				geopoint:dbCmd.geoNear({
					geometry:new hander.Geo.Point(data.longitude,data.latitude),
					maxDistance:1000,
					minDistance:0
				})
			})
			.field({ownerId:false})
			.limit(100)
			.get();
			break;
		case 'detail':
			dbRes = await db.doc(data._id).field({ownerId:false}).get();
			break;
	}
	//返回数据给客户端
	return dbRes.data;
};
