export const baseUrl = "https://api.daodaosmart.com:8080/platform";

module.exports = {
  baseUrl,
  request: function (url, methodType, data) {
    const fullUrl = `${baseUrl}${url}`;

    const token =
      wx.getStorageSync("installToken") || wx.getStorageSync("token") || "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiIiwic2NvcGVzIjpudWxsLCJtZXRhZGF0YSI6eyJhdXRob3JpdHlJZCI6IjYiLCJuaWNrTmFtZSI6Iui2hee6p-euoeeQhuWRmCIsInBob25lTnVtYmVyIjoiIiwidXNlck5hbWUiOiJhZG1pbiJ9LCJleHAiOjE3Mjg3NTE1MTgsInN1YiI6IjE4OWJiMjQ2LTAxMGEtNDc3NC1iMjMyLTdlMzU1ZDMzMGNhZCJ9.zfVuxyv7KJD3Q4rQMD_WzoAzmoPHtKdL5WEmanZzvOiR13nDpvfRumjEZhbik71bgzTC4NcP-g7ceH7kHNK_QDKtNBzb9LH5uBGzKFXqZtpWTWkevy-m4nB_yR0HRdONLwi0kzsKhZG701peGuLEErJZ-LTbIWRBEPo93WaiG_GLUu0Unxy8En4Yjvn0pmD81FFpTiGKpKUUDanrqpL584T4-NNctH7K9Qdy88QHdmPaQ1saMdWp0NxmSAf0en-eMem_J3hcjqvE4_GHGy4T44fHRzlKkyN58ajr8LF98neI25Fr9WUafvtIBocB5yBOl0z_zqkeQOaKfGfGDcWAGA";
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