import http from '../http.js'

// 首页banner
export const getBanner = () => {
    // return http('/user/getBanner')
    return http('/api/banners')
}

// 首页列表
export const getHomeList = () => {
    // return http('/user/getHomeList')
    return http('/api/scenic-spots')
}

// 项目详情
export const projectInfo = (data) => {
    return http('/project/info', data)
} 