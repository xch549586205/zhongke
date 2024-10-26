/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import {
  ComponentWithComputed
} from 'miniprogram-computed';
import Toast from 'tdesign-miniprogram/toast/index';

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
        selectedSku,
        skuList
      } = data
      return skuList.filter(sku => sku.id === selectedSku)[0] || {}
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
    selectedSku: {
      type: Number,
      observer(selectedSku) {
        this.setData({
          selectedSku,
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
  selectedSku: {},
  selectSpecObj: {},

  data: {
    buyNum: 1,
    selectedSku: '',
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
      this.triggerEvent('skuConfirm', {
        buyNum: this.data.buyNum,
        selectedSku: this.data.selectedSku
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
        selectedSku: id
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