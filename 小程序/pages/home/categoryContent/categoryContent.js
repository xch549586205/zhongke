// pages/home/categoryContent/categoryContent.js
import {
  getBannerListApi,
  getCategoryContentListApi,
  getCategoryListApi
} from "../../../services/home.js"
import {
  baseUrl
} from "../../../services/http"
Page({
  onLoad: function (option) {
    this.getCategoryContentList(option.id * 1)
  },
  /**
   * 页面的初始数据
   */
  data: {
    detailBannerList: []
  },


  async getCategoryContentList(id) {
    try {
      const res = await getCategoryContentListApi({
        page: 1,
        pageSize: 1000
      })
      let detailBannerList = res.list.filter(content => content.id === id)[0].detailBanner
      detailBannerList = detailBannerList.map(banner => baseUrl + '/' + banner.url)
      this.setData({
        detailBannerList
      })
      console.log(detailBannerList)
    } catch (error) {
      console.error(error)
      this.setData({
        detailBannerList: []
      })
    }
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

  }
})