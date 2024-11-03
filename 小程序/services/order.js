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
  deleteOrderApi: (data) => request("/order/deleteOrder", "POST", {
    ...data,
    successMessage: '订单已取消'
  }),
  updateOrderAddrApi: (data) => request("/order/updateOrderAddr", "POST", {
    ...data,
  }),
  getOrderNumApi: (data) => request("/order/getOrderNum", "POST", {
    ...data,
  }),
};