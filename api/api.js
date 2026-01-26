import http from './http.js'

// 获取用户信息
export const getUserInfo = () => {
	return http('/getUserInfo')
}

// 游玩项目
export const detailProject = () => {
	return http('/detail/project')
}

// 项目详情
export const projectInfo = (data) => {
	return http('/project/info', data)
} 

// 我的喜欢
export const likeList = () => {
	return http('/like/list')
}