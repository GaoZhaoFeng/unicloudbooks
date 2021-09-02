'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
const doubanbook = require('doubanbook');
const {
	verifyToken
} = require('wx-common')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		data,
		token
	} = event;
	const {
		openid
	} = verifyToken(token);
	let res,reqData;
	let createTime = new Date().getTime();
	switch (data.action) {
		case 'add':
			let dbResult;
			dbResult = await db.collection('books').where({
				isbn: data.isbn,
				studyId:data.id
			}).field({
				openid: false
			}).get()
			if (!dbResult.affectedDocs) {
				const {
					isbn,
					id
				} = data;
				const reqUrl = `https://search.douban.com/book/subject_search?search_text=${isbn}&cat=1001`
				let res = await uniCloud.httpclient.request(reqUrl);
				let reg = /window\.__DATA__ = "(.*)"/;
				
				if (reg.test(res.data)) {
					let bookData = RegExp.$1;
					let doubanData = doubanbook(bookData)[0];
					let coverImage = await uniCloud.httpclient.request(doubanData.cover_url);
					let uplodImg = await uniCloud.uploadFile({
						cloudPath: isbn + '.jpg',
						fileContent: coverImage.data
					})
					reqData = {
						isbn,
						title: doubanData.title,
						coverUrl: uplodImg.fileID,
						abstract: doubanData.abstract,
						studyId: id,
						openid,
						createTime
					}
					const dbRes = await db.collection('books').add(reqData);
					let total = await db.collection('books').where({
						studyId:data.id
					}).count();
					db.collection('studys').doc(data.id).update({
						totalStudys:total.total
					})
					return {}
				}

			} else {
				reqData = dbResult.data[0];
				delete reqData._id;
				reqData.createTime = createTime
				await db.collection('books').add(reqData);
				let count = await db.collection('books').where({
					studyId:data.id
				}).count();
				db.collection('studys').doc(data.id).update({
					totalStudys:count.total
				})
				return {}
			}
			break;
		case 'delete':
			 res = await db.collection('books').doc(data._id).remove();
			 return res;
			break;
		case 'getbookList':
			res = await db.collection('books').where({
				studyId:data._id
			}).field({openid: false}).limit(100).get()
			return res.data;
		   break;
	}

};
