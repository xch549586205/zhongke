import {
  request
} from "./http";
module.exports = {
  getBannerListApi: (data) => request("/small/getBannerList", "POST", data),
  getCategoryContentListApi: (data) => request("/small/getCategoryContentList", "POST", data),
  getCategoryListApi: (data) => request("/small/getCategoryList", "POST", data),
};