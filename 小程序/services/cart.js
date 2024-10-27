import {
  request
} from "./http";
module.exports = {
  getCartByIdApi: (data) => request("/cart/getCartById", "POST", data),
  addSkusToCartApi: (data) => request("/cart/addSkusToCart", "POST", {
    ...data,
    successMessage: '添加成功'
  }),
  removeSkusFromCartApi: (data) => request("/cart/removeOrderSkusFromCart", "POST", {
    ...data,
    successMessage: '已删除'
  }),
  upateCartSkuNumApi: (data) => request("/cart/upateCartSkuNum", "POST", {
    ...data,
    successMessage: '修改成功'
  }),
  replaceCartSkuApi: (data) => request("/cart/replaceCartSku", "POST", {
    ...data,
    successMessage: '修改成功'
  }),
};