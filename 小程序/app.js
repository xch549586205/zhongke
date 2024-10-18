import {
  wxlogin
} from "./services/login";
import {
  getCartByIdApi
} from "./services/cart.js"

App({
  onLaunch: async function () {
    if (!wx.getStorageSync("token")) {
      await this.login();
      // 获取页面栈顶页面
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      console.log(currentPage, 'currentPage')
      if (currentPage.init) {
        setTimeout(currentPage.init, 200)
      }
    }
  },
  onShow: function () {},
  async getOpenIdAndPhoneNumber(jsCode) {
    const res = await wxlogin({
      jsCode,
    });
    wx.setStorageSync("userInfo", res.userInfo ? res.userInfo : res);
    this.globalData.userInfo = res.userInfo ? res.userInfo : res;
    if (res.token) {
      wx.setStorageSync("token", res.token.access_token);
      this.globalData.token = res.token.access_token || "";
    }

  },
  async login(options, startSocket) {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async (res) => {
          if (res.code) {
            await this.getOpenIdAndPhoneNumber(res.code);
            resolve("login success")
          }
        },
        fail: (res) => {
          reject(res);
          console.log(res);
        },
        complete: (res) => {},
      });
    });
  },
  globalData: {
    userInfo: null,
    token: "",
  },
});