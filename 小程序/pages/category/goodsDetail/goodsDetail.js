import Toast from 'tdesign-miniprogram/toast/index';
import {
  getGoodsByIdApi,
} from '../../../services/goods.js';
import {
  addSkusToCartApi
} from '../../../services/cart.js';
import {
  baseUrl
} from "../../../services/http"

import {
  behavior
} from "miniprogram-computed"
const app = getApp();

Page({
  behaviors: [behavior],
  data: {
    authorityId: '4',
    goodsInfo: {},
    goodsTabArray: [{
        name: '商品',
        value: '', // 空字符串代表置顶
      },
      {
        name: '详情',
        value: 'goods-page',
      },
    ],
    jumpArray: [{
        title: '首页',
        url: '/pages/home/home',
        iconName: 'home',
      },
      {
        title: '购物车',
        url: '/pages/skuCart/skuCart',
        iconName: 'cart',
        showCartNum: true,
      },
    ],
    buyNum: 1,
    selectedSkuId: "",
    goodsId: '',
    navigation: {
      type: 'fraction'
    },
    current: 0,
    isSpuSelectPopupShow: false,
    isParamPopupShow: false,
    cart: {}
  },
  computed: {
    shopCartNum(data) {
      const {
        cart
      } = data
      return cart.orderSku ? cart.orderSku.length : 0
    },
    currentSku(data) {
      const {
        goodsSku
      } = data.goodsInfo
      const {
        selectedSkuId
      } = data
      if (!goodsSku || !selectedSkuId) {
        return {}
      }
      const sku = goodsSku.filter(sku => sku.id === selectedSkuId)[0] || {}
      if (!Object.keys(sku).length) {
        return {}
      }
      const price = sku.skuPrice.filter(sp => sp.authorityId === data.authorityId)[0].price
      return {
        ...sku,
        price
      }
    },

    goodsBanners(data) {
      const {
        goodsBanners
      } = data.goodsInfo
      if (!goodsBanners || !goodsBanners.length) {
        return []
      }
      return goodsBanners.map(banner =>
        baseUrl + '/' + banner.url
      ) || []
    },
    goodsDetails(data) {
      const {
        goodsDetails
      } = data.goodsInfo
      if (!goodsDetails || !goodsDetails.length) {
        return []
      }
      return goodsDetails.map(banner =>
        baseUrl + '/' + banner.url
      ) || []
    },
    minSalePrice(data) {
      const {
        goodsSku
      } = data.goodsInfo
      const {
        authorityId
      } = data
      console.log()
      if (!goodsSku) {
        return 0
      }
      const sortSkuList = [...goodsSku].sort((skuA, skuB) => {
        const minPrice_skuA = skuA.skuPrice.filter(p => p.authorityId === authorityId)[0].price
        const minPrice_skuB = skuB.skuPrice.filter(p => p.authorityId === authorityId)[0].price
        return minPrice_skuA - minPrice_skuB
      })
      return sortSkuList[0].skuPrice.filter(p => p.authorityId === authorityId)[0].price
    },
    // specList(data) {
    //   const {
    //     goodsSku
    //   } = data.goodsInfo
    //   return goodsSku
    // }
  },

  clickAddCar() {
    if (this.data.currentSku.id) {
      this.addSkusToCart()
    } else {
      this.showSkuSelectPopup()
    }
  },

  async addSkusToCart() {
    try {
      const {
        id,
        orderSku
      } = this.data.cart
      if (orderSku.filter(os => os.skuId === this.data.currentSku.id).length) {
        this.setData({
          selectedSkuId: ''
        })
        wx.showToast({
          title: '该商品在购物车里已存在！',
          duration: 2000,
          icon: "none"
        })
        return
      }
      const res = await addSkusToCartApi({
        cartId: id,
        sku: [{
          skuId: this.data.currentSku.id,
          skuNum: this.data.buyNum
        }]
      })
      app.globalData.cart = res.data
      this.setData({
        cart: res.data
      })
    } catch (error) {
      console.error(error)
    }
  },


  showSkuSelectPopup() {
    this.setData({
      isSpuSelectPopupShow: true,
    });
  },

  closeSkuSelectPopup() {
    this.setData({
      isSpuSelectPopupShow: false,
    });
  },
  showParamPopup() {
    this.setData({
      isParamPopupShow: true,
    });
  },
  closeParamPopup() {
    this.setData({
      isParamPopupShow: false,
    });
  },
  toNav(e) {
    const {
      url
    } = e.detail;
    wx.switchTab({
      url: url,
    });
  },





  addCart() {
    const {
      isAllSelectedSku
    } = this.data;
    Toast({
      context: this,
      selector: '#t-toast',
      message: isAllSelectedSku ? '点击加入购物车' : '请选择规格',
      icon: '',
      duration: 1000,
    });
  },


  changeNum(e) {
    this.setData({
      buyNum: e.detail.buyNum,
    });
  },


  async getDetail(goodsId) {
    const res = await getGoodsByIdApi({
      id: goodsId * 1
    })
    this.setData({
      goodsInfo: res.data
    })

  },

  skuConfirm(e) {
    const {
      buyNum,
      selectedSkuId
    } = e.detail
    this.setData({
      buyNum,
      selectedSkuId
    }, () => {
      this.addSkusToCart()
    })
    this.closeSkuSelectPopup()
  },
  async getCar() {
    const cart = await app.getCartById()
    this.setData({
      cart
    })
  },

  onLoad(query) {
    const {
      goodsId
    } = query;
    this.setData({
      goodsId: goodsId,
    });
    this.getCar();
    this.getDetail(goodsId);
  },
});