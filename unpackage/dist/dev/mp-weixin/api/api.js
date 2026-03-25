"use strict";
const api_http = require("./http.js");
const projectInfo = (data) => {
  return api_http.http("/project/info", data);
};
const likeList = () => {
  return api_http.http("/like/list");
};
exports.likeList = likeList;
exports.projectInfo = projectInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/api.js.map
