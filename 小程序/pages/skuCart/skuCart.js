// pages/skuCart/skuCart.js
const app = getApp();
import {
  getTotalAmount
} from "@/utils/mydecimal.js"
import {
  baseUrl
} from "../../services/http"
import {
  newOrderApi,
  addCartSkusToOrderApi
} from "../../services/order"
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
      const {
        cart,
        selectOrderList
      } = data
      if (!cart.orderSku) {
        return 0
      }
      const selectedSkuList = cart.orderSku.filter(os => selectOrderList.indexOf(os.id) !== -1)
      const _totalAmount = getTotalAmount(selectedSkuList)
      return _totalAmount
    },
    disabledToSettle(data) {

      const {
        selectOrderList,
        cart
      } = data
      if (!cart.orderSku) {
        return true
      }
      if (!selectOrderList.length) {
        return true
      }
      let disabled = false
      // 判断每一项的库存不足
      cart.orderSku.forEach(item => {
        const {
          skuNum,
          sku
        } = item
        if (skuNum > sku.kuCun) {
          disabled = true
        }
      })
      return disabled
    },
    skuList(data) {
      const {
        cart,
        selectOrderList
      } = data
      if (!cart.orderSku) {
        return []
      }
      return cart.orderSku.map(sku => {
        return {
          ...sku,
          selected: selectOrderList.indexOf(sku.id) !== -1
        }
      })
    },
    isAllSelected(data) {
      const {
        cart,
        selectOrderList
      } = data
      if (!cart.orderSku) {
        return false
      }
      return cart.orderSku.length === selectOrderList.length
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
    selectOrderList: [],
    orderSkuId: null
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
    this.getTabBar().init();
    this.getCar()
  },
  async handleToSettle() {
    try {
      const userInfo = wx.getStorageSync("userInfo")
      const res = await newOrderApi({
        userId: userInfo.id,
      })
      const {
        id
      } = res.data
      await addCartSkusToOrderApi({
        orderId: id,
        cartId: userInfo.cartId,
        skuIds: this.data.selectOrderList
      })
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?id=' + id
      });
    } catch (error) {
      console.error(error)
    }
  },


  selectClick(e) {
    const
      id = e.detail
    const {
      selectOrderList
    } = this.data
    const newSelectList = [...selectOrderList]
    const currentIdIndex = selectOrderList.indexOf(id)
    if (currentIdIndex === -1) {
      newSelectList.push(id)
    } else {
      newSelectList.splice(currentIdIndex, 1)
    }
    this.setData({
      selectOrderList: newSelectList
    })
  },
  selectAll(e) {
    const {
      isAllSelected
    } = e.detail
    if (!isAllSelected) {
      this.setData({
        selectOrderList: this.data.cart.orderSku.map(sku => sku.id)
      })
    } else {
      this.setData({
        selectOrderList: []
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
    console.log(cart)
    this.handleCart(cart)
  },

  handleCart(cart) {
    const userInfo = wx.getStorageSync("userInfo")
    const {
      authorityId
    } = userInfo
    app.globalData.cart = cart
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
      orderSkuId: sku.id,
      selectedSkuId: sku.skuId,
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
      selectedSkuId
    } = e.detail
    const userInfo = wx.getStorageSync("userInfo")
    const {
      cartId
    } = userInfo
    const res = await replaceCartSkuApi({
      "destSkuId": selectedSkuId,
      "destSkuNum": buyNum,
      cartId,
      sourceSkuId: this.data.selectedSkuId
    })
    try {
      //这里orderId会变，所以要把旧选中orderId换成新的
      const newSelectList = [...this.data.selectOrderList]
      const selectIndex = this.data.selectOrderList.indexOf(this.data.orderSkuId)
      if (selectIndex !== -1) {
        newSelectList[selectIndex] = res.data.orderSku.filter(os => os.skuId === selectedSkuId)[0].id
        this.setData({
          selectOrderList: newSelectList
        })
      }
    } catch (error) {
      console.error(error)
    }
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