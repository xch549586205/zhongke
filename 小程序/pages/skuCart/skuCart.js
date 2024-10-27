// pages/skuCart/skuCart.js
const app = getApp();
import {
  baseUrl
} from "../../services/http"
import {
  removeSkusFromCartApi,
  upateCartSkuNumApi,
  replaceCartSkuApi
} from "../../services/cart"
import {
  behavior
} from "miniprogram-computed"
Page({
  behaviors: [behavior],
  computed: {
    totalAmount(data) {
      const userInfo = wx.getStorageSync("userInfo")
      const {
        authorityId
      } = userInfo
      const {
        cart,
        selectList
      } = data
      if (!cart.orderSku) {
        return 0
      }
      let _totalAmount = 0
      const selectedSkuList = cart.orderSku.filter(os => selectList.indexOf(os.id) !== -1)
      selectedSkuList.map(sku => {
        const {
          skuId
        } = sku
        const {
          skuPrice
        } = sku.sku
        const currentSkuPrice = skuPrice.filter(_sp => _sp.skuId === skuId && _sp.authorityId === authorityId)[0].price
        _totalAmount += currentSkuPrice
      })
      return _totalAmount
    },
    skuList(data) {
      const {
        cart,
        selectList
      } = data
      if (!cart.orderSku) {
        return []
      }
      return cart.orderSku.map(sku => {
        return {
          ...sku,
          selected: selectList.indexOf(sku.id) !== -1
        }
      })
    },
    isAllSelected(data) {
      const {
        cart,
        selectList
      } = data
      if (!cart.orderSku) {
        return false
      }
      return cart.orderSku.length === selectList.length
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    isSpuSelectPopupShow: false,
    cart: {},
    changeSkuGoodsInfo: null,
    skuNum: 0,
    selectList: []
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
    await this.getCar()
    this.getTabBar().init();
  },
  handleToSettle() {
    
  },


  selectClick(e) {
    const
      id = e.detail
    const {
      selectList
    } = this.data
    const newSelectList = [...selectList]
    const currentIdIndex = selectList.indexOf(id)
    if (currentIdIndex === -1) {
      newSelectList.push(id)
    } else {
      newSelectList.splice(currentIdIndex, 1)
    }
    this.setData({
      selectList: newSelectList
    })
  },
  selectAll(e) {
    const {
      isAllSelected
    } = e.detail
    if (!isAllSelected) {
      this.setData({
        selectList: this.data.cart.orderSku.map(sku => sku.id)
      })
    } else {
      this.setData({
        selectList: []
      })
    }

  },
  goCategory() {
    wx.switchTab({
      url: '/pages/category/category/category'
    });
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
    const {
      zkGoods
    } = sku.sku
    this.setData({
      skuNum: sku.skuNum,
      selectedSku: sku.skuId,
      isSpuSelectPopupShow: true,
      changeSkuGoodsInfo: {
        ...zkGoods,
        thumb: sku.thumb
      }
    });
    console.log(zkGoods)

  },
  async changeSkuConfirm(e) {
    const {
      buyNum,
      selectedSku
    } = e.detail
    const userInfo = wx.getStorageSync("userInfo")
    const {
      cartId
    } = userInfo
    const res = await replaceCartSkuApi({
      "destSkuId": selectedSku,
      "destSkuNum": buyNum,
      cartId,
      sourceSkuId: this.data.selectedSku
    })
    app.globalData.cart = res.data
    this.closeSkuSelectPopup()
    this.handleCart(res.data)
  },
  closeSkuSelectPopup() {
    this.setData({
      isSpuSelectPopupShow: false,
    });
  },
  async upateCartSkuNum(e) {
    try {
      const {
        id,
        skuNum
      } = e.detail
      const userInfo = wx.getStorageSync("userInfo")
      const {
        cartId
      } = userInfo
      const res = await upateCartSkuNumApi({
        orderSkuId: id,
        cartId,
        skuNum
      })
      app.globalData.cart = res.data
      this.handleCart(res.data)
    } catch (error) {
      this.getCar()
    }

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