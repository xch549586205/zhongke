import {
  request
} from "./http";
module.exports = {
  getCartByIdApi: (data) => request("/cart/getCartById", "POST", data),
  addSkusToCartApi: (data) => request("/cart/addSkusToCart", "POST", {
    ...data,
    successMessage: true
  }),
  removeSkusFromCartApi: (data) => request("/cart/removeSkusFromCart", "POST", {
    ...data,
    successMessage: true
  }),
};