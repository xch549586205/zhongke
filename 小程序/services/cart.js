import {
  request
} from "./http";
module.exports = {
  getCartByIdApi: (data) => request("/cart/getCartById", "POST", data),
};