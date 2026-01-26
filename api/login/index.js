import http from '../http.js'

// 登录
export const login = (code) => {
    return http('/login', { code }, 'POST')
}