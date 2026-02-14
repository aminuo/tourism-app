import http from '../http.js'

// 首页banner
export const getBanner = () => {
    return http('/api/banners')
}

// 首页列表
// 支持按名称和标签查询
export const getHomeList = (params = {}) => {
    return http('/api/scenic-spots', params, 'GET')
}

// 获取标签列表
export const getTagList = () => {
    return http('/api/tags')
}

// 项目详情
export const getDetail = (id) => {
    return http(`/api/scenic-spots/${id}`, 'GET')
} 