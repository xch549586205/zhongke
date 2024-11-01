import {
  request
} from "./http";
module.exports = {
  newOrderApi: (data) => request("/order/newOrder", "POST", {
    ...data,
  }),
  addCartSkusToOrderApi: (data) => request("/order/addCartSkusToOrder", "POST", {
    ...data,
  }),
  getOrderListApi: (data) => request("/order/getOrderList", "POST", {
    ...data,
  }),
  getOrderApi: (data) => request("/order/getOrder", "POST", {
    ...data,
  }),
};