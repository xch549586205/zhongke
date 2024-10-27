export const baseUrl = "https://api.daodaosmart.com:8080/platform";

module.exports = {
  baseUrl,
  request: function (url, methodType, data) {
    const fullUrl = `${baseUrl}${url}`;
    const token = wx.getStorageSync("token")
    if (!token && url !== '/base/sysCode2Session' && url !== '/base/getWxPhoneNumber') {
      return
    }
    console.log("请求url:", url, "----------", "请求参数:", data);
    return new Promise((resolve, reject) => {
      const filterParams = Object.fromEntries(Object.entries(data).filter(([key, val]) => key !== 'successMessage'))
      wx.request({
        url: fullUrl,
        method: methodType,
        header: {
          "content-type": "application/json", // 默认值
          token: token,
        },
        data: filterParams,
        success(res) {
          console.log("请求结果:", res.data);
          if (res.data.code == 0) {
            resolve(res.data.data);
            if (data.successMessage) {
              wx.showToast({
                title: typeof data.successMessage === 'string' ? data.successMessage : res.data.msg,
                icon: "success",
              });
            }
            wx.hideLoading();
          } else {
            reject(res.data);
            wx.hideLoading();
            wx.showToast({
              title: res.data.msg,
              icon: "none",
            });
          }
        },
        fail(err) {
          wx.showToast({
            title: "Interface request error",
            icon: "none",
          });
          reject(err);
        },
      });
    });
  },
};