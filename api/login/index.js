import http from '../http.js';

// 登录
export const login = (code) => {
  return http('/api/login', { code }, 'POST');
};

// 获取用户信息
export const getUserInfo = () => {
  return http('/api/getUserInfo', {}, 'GET');
};

// 更新用户信息
export const updateUserInfo = (data) => {
  // 移除token参数，后端从HTTP Header中读取
  const { token, ...updateData } = data;
  return http('/api/updateUserInfo', updateData, 'POST');
};
