export const baseUrl = "https://api.daodaosmart.com:8080/platform";

module.exports = {
  baseUrl,
  request: function (url, methodType, data) {
    const fullUrl = `${baseUrl}${url}`;

    const token =
      wx.getStorageSync("installToken") || wx.getStorageSync("token") || "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiIiwic2NvcGVzIjpudWxsLCJtZXRhZGF0YSI6eyJhdXRob3JpdHlJZCI6IjYiLCJuaWNrTmFtZSI6Iui2hee6p-euoeeQhuWRmCIsInBob25lTnVtYmVyIjoiIiwidXNlck5hbWUiOiJhZG1pbiJ9LCJleHAiOjE3Mjc4ODQyOTcsInN1YiI6IjA4NTFmMjJlLTBmMjQtNDhmNy1iZDk2LTc3MjM5NTc5Y2I4NSJ9.hfnu822uHcU6cLFL8asMJYtQ6XEln8eZ6CnvRSJVSeyRC1N5mbWvx4-gZqwGCQM8QzyeoUTNcboCUP3ri8HumCdVfqM0ODlhWrgvK7VjwMIKfpe-AWhFuT0dHNy_IpNlUqvVPkl90hohfCUmmt4KblF4izXeSD2t2IHgO5WtHlr0yWYDDw8k9uqd7OzrpjdNBaVhG0oBnqVGAk4fgEObZdB8O0SbImAnKaHNH3fp7HbfMO3jhFa_qiCV353nJbaPwPt8akHscIhm9pP0OoRhhCR6z_7KgfO6erJM8O9T51VP0VLEku75BZ5zJ3aPI4Nll8LdlG214-qekElN4IzSWg";
    if (url.indexOf("/device/getDevicesLatestState") === -1) {
      wx.showLoading({
        title: "loading...",
      });
    }
    console.log("请求url:", url, "----------", "请求参数:", data);
    return new Promise((resolve, reject) => {
      wx.request({
        url: fullUrl,
        method: methodType,
        header: {
          "content-type": "application/json", // 默认值
          token: token,
        },
        data,
        success(res) {
          console.log("请求结果:", res.data);
          if (res.data.code == 0) {
            resolve(res.data.data);
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