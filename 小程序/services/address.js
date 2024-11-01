import {
  request
} from "./http";
module.exports = {
  addUserAddrApi: (data) => request("/user/addUserAddr", "POST", {
    ...data,
    successMessage: "添加成功"
  }),
  deleteUserAddrApi: (data) => request("/user/deleteUserAddr", "POST", {
    ...data,
    successMessage: "删除成功"
  }),
  updateUserAddrApi: (data) => request("/user/updateUserAddr", "POST", {
    ...data,
    successMessage: "修改成功"
  }),
  setUserDefaultAddrApi: (data) => request("/user/setUserDefaultAddr", "POST", {
    ...data,
    successMessage: "设置成功"
  }),
  getUserAddrListApi: (data) => request("/user/getUserAddr", "POST", {
    ...data,
  }),  setUserDefaultAddrApi: (data) => request("/user/setUserDefaultAddr", "POST", {
    ...data,
  }),
};