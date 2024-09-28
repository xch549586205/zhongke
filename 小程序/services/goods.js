import {
  request
} from "./http";
module.exports = {
  searchGoodsApi: (data) => request("/goods/searchGoods", "POST", data),
  getGoodsByIdApi: (data) => request("/goods/getGoodsById", "POST", data),
  getGoodsTypeListApi: (data) => request("/goods/getGoodsTypeList", "POST", data),
};