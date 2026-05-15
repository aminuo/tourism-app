// http://apifox.com/apidoc/shared-8776d148-3d28-42a1-bf4b-c2285ac6e644/api-264486153
let baseUrl = '';

//mock模拟数据
// baseUrl = 'https://m1.apifoxmock.com/m1/4728220-0-default/api'
// 本地数据，通过Vite代理转发
baseUrl = 'http://192.168.242.207:8081'

const ERROR_MESSAGES = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '无权限访问',
  404: '请求资源不存在',
  500: '服务器内部错误，请稍后重试'
}

const getErrorMsg = (code, msg) => {
  return msg || ERROR_MESSAGES[code] || '请求失败'
}

export default function http(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + (url.startsWith('/') ? url : '/' + url),
      data,
      method,
      header: {
        'token': uni.getStorageSync('token') || '',
      },
      success: res => {
        if (res.statusCode === 200) {
          const { code, data: resData, msg } = res.data
          if (code === 200 || code === 1) {
            resolve(resData)
          } else {
            uni.showToast({
              title: getErrorMsg(code, msg),
              icon: 'none',
              duration: 2000
            })
            reject({ code, msg: getErrorMsg(code, msg) })
          }
        } else if (res.statusCode === 401) {
          uni.showToast({
            title: getErrorMsg(401, res.data?.msg),
            icon: 'none',
            duration: 2000
          })
          uni.removeStorageSync('token')
          setTimeout(() => {
            uni.switchTab({ url: '/pages/my/index' })
          }, 1500)
          reject({ code: 401, msg: '登录已过期' })
        } else if (res.statusCode === 500) {
          uni.showToast({
            title: getErrorMsg(500, res.data?.msg),
            icon: 'none',
            duration: 2000
          })
          reject({ code: 500, msg: '服务器错误' })
        } else {
          uni.showToast({
            title: getErrorMsg(res.statusCode, res.data?.msg),
            icon: 'none',
            duration: 2000
          })
          reject({ code: res.statusCode, msg: getErrorMsg(res.statusCode, res.data?.msg) })
        }
      },
      fail: () => {
        uni.showToast({
          title: '网络请求失败，请检查网络连接',
          icon: 'none',
          duration: 2000
        })
        reject({ code: -1, msg: '网络请求失败' })
      },
    })
  })
}