import http from '../http.js';

// 添加收藏
export const addFavorite = (scenicSpotId) => {
  return http('/api/addFavorite', { scenicSpotId }, 'POST');
};

// 取消收藏
export const removeFavorite = (scenicSpotId) => {
  return http('/api/removeFavorite', { scenicSpotId }, 'POST');
};

// 获取收藏列表
export const getFavorites = () => {
  return http('/api/getFavorites', {}, 'GET');
};
