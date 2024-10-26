import {
  request
} from "./http";
module.exports = {
  newApplyApi: (data) => request("/apply/newApply", "POST", data),
};