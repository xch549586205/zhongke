// pages/applyDealer/applyDealer.js
import {
  newApplyApi
} from "../../services/apply"
import Toast from 'tdesign-miniprogram/toast/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyName: '',
    contactName: '',
    contactPhone: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onInputChange(e) {
    const {
      key
    } = e.currentTarget.dataset
    const {
      value
    } = e.detail
    this.setData({
      [key]: value
    })
  },
  async submit() {
    try {
      const res = await newApplyApi({
        ...this.data
      })
      if (res.state === '已申请') {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '申请加盟成功，请耐心等待审批',
          icon: 'success',
        });
        setTimeout(wx.navigateBack, 2000);
      }
    } catch (error) {
      console.error(error)
    }
  }
})