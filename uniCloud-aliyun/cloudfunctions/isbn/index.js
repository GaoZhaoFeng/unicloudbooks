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
	let res, reqData;
	let createTime = new Date().getTime();
	switch (data.action) {
		case 'add':
			let dbResult;
			dbResult = await db.collection('books').where({
				isbn: data.isbn,
				// studyId: data.id
			}).field({
				openid: false
			}).get()
			//当书房已有这本书，则取自己数据库的那一条再做新增，没有时再去豆瓣爬取数据
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
					handerStudyTotal(data.id)
					return {}
				}

			} else {
				reqData = dbResult.data[0];
				delete reqData._id;
				reqData.createTime = createTime;
				reqData.studyId = data.id;  //因为是获取书本数据库有没有当前这本书，有的话，获取之后把原来的书房覆盖成当前书房即可添加
				await db.collection('books').add(reqData);
				handerStudyTotal(data.id)
				return {}
			}
			break;
		case 'delete':
			res = await db.collection('books').doc(data._id).remove();
			handerStudyTotal(data.id)
			return res;
			break;
		case 'getbookList':
			res = await db.collection('books').where({
				studyId: data._id
			}).field({
				openid: false
			}).limit(100).get()
			return res.data;
			break;
	}
	//书本的增删 统一修改书房的书本数量
	async function handerStudyTotal(_id) {
		let count = await db.collection('books').where({
			studyId: _id
		}).count();
		db.collection('studys').doc(_id).update({
			totalStudys: count.total
		})
	}
};
