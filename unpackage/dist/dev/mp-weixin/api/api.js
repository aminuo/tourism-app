"use strict";
const api_http = require("./http.js");
const getUserInfo = () => {
  return api_http.http("/getUserInfo");
};
const projectInfo = (data) => {
  return api_http.http("/project/info", data);
};
const likeList = () => {
  return api_http.http("/like/list");
};
exports.getUserInfo = getUserInfo;
exports.likeList = likeList;
exports.projectInfo = projectInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/api.js.map
