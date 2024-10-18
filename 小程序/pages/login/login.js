// 获取应用实例
import {
  wxlogin,
  getWxPhoneNumber,
} from "../../services/login";

const app = getApp();

Page({
  data: {
    checked: false,
    motto: "Hello World",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse("open-data.type.userAvatarUrl") &&
      wx.canIUse("open-data.type.userNickName"), // 如需尝试获取用户信息可改为false
    openId: "",
    code: "",
  },
  onLoad() {},
  changeChecked(e) {
    this.setData({
      checked: e.detail.checked
    });
  },
  async getPhoneNumber(e) {
    console.log(e)
    if (!e.detail.code) {
      return
    }
    this.setData({
      code: e.detail.code,
    });
    if (!app.globalData.userInfo || !app.globalData.userInfo.openId) {
      await app.login();
    }
    const params = {
      code: e.detail.code,
      openId: app.globalData.userInfo.openId,
      did: app.globalData.did,
    };
    const res = await getWxPhoneNumber(params);
    app.login();
    if (res.token) {
      wx.navigateBack();
    }
  },
  goServiceAgreement() {
    wx.navigateTo({
      url: "/pages/serviceAgreement/serviceAgreement",
    });
  },
  goPrivacyAgreement() {
    wx.navigateTo({
      url: "/pages/privacyAgreement/privacyAgreement",
    });
  },
  goAssignmentPage() {
    wx.redirectTo({
      url: "/pages/assignment/assignment",
    });
  },
});