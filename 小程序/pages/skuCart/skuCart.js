// pages/skuCart/skuCart.js
const app = getApp();
import {
  baseUrl
} from "../../services/http"
import {
  removeSkusFromCartApi
} from "../../services/cart"
import {
  behavior
} from "miniprogram-computed"
Page({
  behaviors: [behavior],
  computed: {},
  /**
   * 页面的初始数据
   */
  data: {
    cart: {}
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
  async onShow() {
    this.getTabBar().init();
    this.getCar()
  },
  async getCar() {

    const cart = await app.getCartById()
    this.handleCart(cart)

  },
  handleCart(cart) {
    const userInfo = wx.getStorageSync("userInfo")
    const {
      authorityId
    } = userInfo
    this.setData({
      cart: {
        ...cart,
        desc: cart.description,
        orderSku: cart.orderSku.map(sku => {
          return {
            ...sku,
            thumb: baseUrl + '/' + "uploads/file/26726b57cba3768d3b4b0cb07c60b2f0_20241023204954.png",
            goodsName: sku.sku.goodsName,
            skuName: sku.sku.specName,
            lineClamp: 2,
            price: sku.sku.skuPrice ? sku.sku.skuPrice.filter(price => price.authorityId === authorityId)[0].price : 0
          }
        }),
      }
    })
  },
  async deleteSkuFormCar(skuId) {
    const userInfo = wx.getStorageSync("userInfo")
    const {
      cartId
    } = userInfo
    const res = await removeSkusFromCartApi({
      cartId,
      skuIds: [skuId.detail]
    })
    app.globalData.cart = res.data
    this.handleCart(res.data)
  },
  async openChangeSkuPopup(e) {
    const {
      sku
    } = e.detail
    const zkGoods = sku.sku
    console.log(zkGoods)

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