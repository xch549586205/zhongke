import Toast from 'tdesign-miniprogram/toast/index';
import {
  getGoodsByIdApi
} from '../../../services/goods.js';

import {
  baseUrl
} from "../../../services/http"

import {
  behavior
} from "miniprogram-computed"

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
        url: '/pages/cart/index',
        iconName: 'cart',
        showCartNum: true,
      },
    ],
    buyNum: 1,
    selectedSku: "",
    goodsId: '',
    navigation: {
      type: 'fraction'
    },
    current: 0,
  },
  computed: {
    currentSku(data) {
      const {
        goodsSku
      } = data.goodsInfo
      const {
        selectedSku
      } = data
      if (!goodsSku || !selectedSku) {
        return {}
      }
      return goodsSku.filter(sku => sku.id === selectedSku)[0] || {}
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
  handlePopupHide() {
    this.setData({
      isSpuSelectPopupShow: false,
    });
  },

  showSkuSelectPopup() {
    this.setData({
      isSpuSelectPopupShow: true,
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
    console.log(e.detail, 123)
    const {
      buyNum,
      selectedSku
    } = e.detail
    this.setData({
      buyNum,
      selectedSku
    })
    this.handlePopupHide()
  },


  onLoad(query) {
    const {
      goodsId
    } = query;
    this.setData({
      goodsId: goodsId,
    });
    this.getDetail(goodsId);
  },
});