let token = uni.getStorageSync('token');


function call(option = {}) {
	return new Promise((resolve,reject) => {
		if(!option.data) option.data = {};
		if(token) option.data.token = token;
		uni.showLoading()
		uniCloud.callFunction({
			name:option.name,
			data:option.data,
			success: (res) => {
				if(res.result.token) token = res.result.token;
				option.success && option.success(res);
				resolve(res)
			},
			fail: (err) => {
				option.fail && option.fail();
				reject()
			},
			complete: () => {
				uni.hideLoading();
				option.complete && option.complete();
			}
		})
	})
}

module.exports = {
	call:call
}