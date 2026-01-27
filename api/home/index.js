import http from '../http.js'

// 首页banner
export const getBanner = () => {
    // return http('/user/getBanner')
    return http('/api/banners')
}

// 首页列表
// 支持按名称和标签查询
export const getHomeList = (params = {}) => {
    // return http('/user/getHomeList')
    return http('/api/scenic-spots', params, 'GET')
}

// 项目详情
export const projectInfo = (data) => {
    return http('/project/info', data)
} 