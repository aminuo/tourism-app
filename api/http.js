// http://apifox.com/apidoc/shared-8776d148-3d28-42a1-bf4b-c2285ac6e644/api-264486153
let baseUrl = '';

//通过环境来判断
if (process.env.NODE_ENV === 'development') {
	//baseUrl = "http://localhost:5173/api"
	baseUrl = 'https://m1.apifoxmock.com/m1/4728220-0-default/api'
} else {
	baseUrl = 'https://m1.apifoxmock.com/m1/4728220-0-default/api'
}

export default function http(url, data = {}, method = 'GET') {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + (url.startsWith('/') ? url : '/' + url), // 确保路径拼接正确
			data,
			method,
			header: {
				'token': uni.getStorageSync('token') || '', // 使用同步方法获取 token
			},
			success: res => {
				if (res.statusCode === 200) {
					if (res.data.code === 1) {
						resolve(res.data.data);
					} else if (res.data.code === 0) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
						});
						reject(res.data.msg);
					}
				}
			},
			fail: () => {
				uni.showToast({
					title: '服务器请求失败，请稍后重试', // 修改为更明确的提示信息
					icon: 'none',
				});
			},
		});
	});
}