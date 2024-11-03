/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import {
  ComponentWithComputed
} from 'miniprogram-computed';
import Toast from 'tdesign-miniprogram/toast/index';
const app = getApp()

ComponentWithComputed({
  computed: {

    skuList(data) {
      const {
        goodsSku
      } = data.goodsInfo
      return goodsSku || {}
    },
    selectedSkuInfo(data) {
      const {
        selectedSkuId,
        skuList
      } = data
      return skuList.filter(sku => sku.id === selectedSkuId)[0] || {}
    },
    selectedSkuPrice(data) {
      const {
        selectedSkuInfo,
        authorityId
      } = data
      if (!selectedSkuInfo.id) {
        return null
      }
      return selectedSkuInfo.skuPrice.filter(sp => sp.authorityId === authorityId)[0].price
    }

  },
  properties: {
    selectedSkuId: {
      type: Number,
      observer(selectedSkuId) {
        this.setData({
          selectedSkuId,
        });
      },
    },
    goodsInfo: {
      type: Object,
      value: {},
    },
    image: {
      type: String,
    },
    title: String,
    show: {
      type: Boolean,
      value: false,
    },
    buyNum: {
      type: Number,
      observer(buyNum) {
        this.setData({
          buyNum,
        });
      },
    },
  },



  initStatus: false,
  selectedSkuId: {},
  selectSpecObj: {},

  data: {
    buyNum: 1,
    selectedSkuId: '',
    goodsInfo: {},
    authorityId: '4',
  },

  methods: {

    handlePopupHide() {
      this.triggerEvent('closeSkuSelectPopup', {
        show: false,
      });
    },

    skuConfirm() {
      console.log(app.globalData, 123)
      const cart = app.globalData.cart
      if (cart && cart.orderSku && cart.orderSku.length && cart.orderSku.filter(sku => sku.skuId === this.data.selectedSkuId).length) {
        wx.showToast({
          title: '该商品在购物车里已存在！',
          duration: 2000,
          icon: "none"
        })
        return
      }
      this.triggerEvent('skuConfirm', {
        buyNum: this.data.buyNum,
        selectedSkuId: this.data.selectedSkuId
      });
    },

    addCart() {
      const {
        isStock
      } = this.properties;
      if (!isStock) return;
      this.triggerEvent('addCart');
    },


    chooseSku(e) {
      const {
        id
      } = e.currentTarget.dataset
      this.setData({
        selectedSkuId: id
      })
    },

    handleBuyNumChange(e) {
      const {
        value
      } = e.detail;
      this.setData({
        buyNum: value,
      });
    },
  },
});