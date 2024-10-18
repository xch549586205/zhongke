import {
  request
} from "./http";

module.exports = {
  wxlogin: (data) => request("/base/sysCode2Session", "POST", data),
  getWxPhoneNumber: (data) => request("/base/getWxPhoneNumber", "POST", data),
};