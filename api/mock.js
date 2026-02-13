import Mock from 'mockjs'
import pageApi from './mockData/pageApi'

// 配置首页轮播图的 mock 数据
Mock.mock(/api\/banners/, 'get', () => {
    const result = pageApi.getBanner()
    return {
        code: 1,
        data: result.data.bannerList
    }
})

// 配置首页景点列表的 mock 数据
Mock.mock(/api\/scenic-spots/, 'get', pageApi.getHomeList)

// 配置喜欢列表的 mock 数据
Mock.mock(/like\/list/, 'get', () => {
    const result = pageApi.getHomeList()
    return result.data
})

// 配置获取用户信息的 mock 数据
Mock.mock(/getUserInfo/, 'get', () => {
    return {
        code: 1,
        data: {
            avatarUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
            nickName: '游客用户'
        }
    }
})

// 配置登录的 mock 数据
Mock.mock(/login/, 'get', () => {
    return {
        code: 1,
        data: {
            token: 'mock-token-' + Date.now()
        }
    }
})