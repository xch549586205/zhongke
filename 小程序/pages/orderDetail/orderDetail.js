// pages/createOrder/createOrder.js
import {
  setWatcher
} from "@/utils/watch";

import {
  getOrderApi,
  deleteOrderApi,
  updateOrderAddrApi
} from "@/services/order"
import {
  baseUrl
} from "@/services/http"
import {
  behavior
} from "miniprogram-computed"
import {
  getTotalAmount,
  getPriceByAuthorityId
} from "@/utils/mydecimal.js"
import {
  getUserAddrListApi,

} from "@/services/address"
import moment from "moment"

const app = getApp();

Page({
  behaviors: [behavior],

  /**
   * 页面的初始数据
   */
  isSetIng: false,
  data: {
    confirmBtn: {
      content: '确定',
      variant: 'base'
    },
    userAddrList: [],
    cancleDialogVisible: false,
    orderDetail: {},
    isFirstSetAddrId: true,
    addrId: null,
  },

  computed: {
    totalAmount(data) {
      const {
        orderSku
      } = data.orderDetail
      if (orderSku && orderSku.length) {
        return getTotalAmount(orderSku)
      }
      return 0
    },
    currentAddress(data) {
      const {
        addrId,
        userAddrList
      } = data
      if (!addrId || !userAddrList) {
        return ''
      }
      try {
        const addrInfo = userAddrList.filter(addr => addr.id === addrId)[0]
        return `${addrInfo.province}${addrInfo.city}${addrInfo.area}${addrInfo.detail}`
      } catch (error) {
        return ''
      }
    },
    orterCreateTime(data) {
      const {
        ts
      } = data.orderDetail
      if (ts) {
        return moment(ts * 1000).format("YYYY-MM-DD HH:mm:ss")
      }
      return ''
    },
    addressNamePhone(data) {
      const {
        addrId,
        userAddrList
      } = data
      if (!addrId || !userAddrList) {
        return ''
      }
      try {
        const addrInfo = userAddrList.filter(addr => addr.id === addrId)[0]
        return `${addrInfo.userName} ${addrInfo.phoneNumber}`
      } catch (error) {
        return ''
      }
    },
    skuList(data) {
      const {
        orderSku
      } = data.orderDetail
      if (orderSku && orderSku.length) {
        return orderSku.map(sku => ({
          ...sku,
          id: sku.id,
          thumb: sku.sku.zkGoods.goodsBanners ? baseUrl + "/" + sku.sku.zkGoods.goodsBanners[0].url : '',
          title: sku.sku.zkGoods.name,
          skuId: sku.skuId,
          specs: [sku.sku.specName],
          price: getPriceByAuthorityId(sku.sku.skuPrice),
          num: sku.skuNum,
          titlePrefixTags: sku.tagText ? [{
            text: sku.tagText
          }] : [],
        }))
      } else {
        return []
      }
    }
  },
  async onConfirmCancle() {
    await deleteOrderApi({
      id: this.data.orderDetail.id
    })
    wx.navigateBack()
  },
  closeCancleDialog() {
    this.setData({
      cancleDialogVisible: false
    });
  },
  onCancelClick() {
    this.setData({
      cancleDialogVisible: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {
      id = ''
    } = options;
    await this.getOrderDetail(id)
    this.getAddr()
    setWatcher(this)
  },

  watch: {
    addrId(_addrId) {
      if ((this.data.isFirstSetAddrId && this.data.orderDetail.userAddr && this.data.orderDetail.userAddr.id) || this.isSetIng || !_addrId) {
        return
      }
      this.updateOrderAddr(_addrId)
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
  async updateOrderAddr(addrId) {
    if (this.isSetIng) {
      return
    }
    this.isSetIng = true
    const userInfo = wx.getStorageSync("userInfo")
    if (this.data.orderDetail.id) {
      await updateOrderAddrApi({
        id: this.data.orderDetail.id,
        addrId,
        userId: userInfo.id,
      })
    }
    this.isSetIng = false

  },
  async getAddr() {
    const userInfo = wx.getStorageSync("userInfo")
    const res = await getUserAddrListApi({
      id: userInfo.id
    })
    const {
      defaultAddrId,
      userAddr
    } = res.user
    this.setData({
      userAddrList: userAddr
    })
    if (this.data.orderDetail.userAddr && this.data.orderDetail.userAddr.id) {
      return
    }
    const defalutIndex = !userAddr.length ? -1 : userAddr.findIndex(addr => addr.id === defaultAddrId)
    const hasDefaultAddr = defalutIndex !== -1
    if (Boolean(!userAddr.length)) {
      this.setData({
        addrId: null
      })
      return
    }
    if (hasDefaultAddr) {
      const defalutAddrInfo = userAddr[defalutIndex]
      this.setData({
        addrId: defalutAddrInfo.id
      })
      return
    }
    // ，没有默认地址但是添加过地址，就选中第一个地址
    if (!hasDefaultAddr && userAddr.length) {
      this.setData({
        addrId: userAddr[0].id
      })
    }
  },
  async getOrderDetail(id) {
    const res = await getOrderApi({
      id
    })
    this.setData({
      orderDetail: res.data
    })
    if (res.data.userAddr && res.data.userAddr.id) {
      this.setData({
        addrId: res.data.userAddr.id
      }, () => {
        this.setData({
          isFirstSetAddrId: false
        })
      })
    }
  },
  goAddr() {
    wx.navigateTo({
      url: `/pages/usercenter/address/list/index?selectMode=true`
    });
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