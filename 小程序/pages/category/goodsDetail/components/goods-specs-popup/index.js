/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import {
  ComponentWithComputed
} from 'miniprogram-computed';
import Toast from 'tdesign-miniprogram/toast/index';

ComponentWithComputed({
  computed: {
    selectedSkuInfo(data) {
      const {
        selectedSku,
        goodsSku
      } = data
      return goodsSku.filter(sku => sku.id === selectedSku)[0] || {}
    },
    currentSkuPrice(data) {
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
    src: {
      type: String,
    },
    title: String,
    show: {
      type: Boolean,
      value: false,
    },
    limitBuyInfo: {
      type: String,
      value: '',
    },
    isStock: {
      type: Boolean,
      value: true,
    },
    limitMaxCount: {
      type: Number,
      value: 999,
    },
    limitMinCount: {
      type: Number,
      value: 1,
    },

    goodsSku: {
      type: Array,
      value: [],
    },

    count: {
      type: Number,
      value: 1,
      observer(count) {
        this.setData({
          buyNum: count,
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
      this.triggerEvent('closeSpecsPopup', {
        show: false,
      });
    },

    skuConfirm(e) {
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

    buyNow() {
      const {
        isAllSelectedSku
      } = this.data;
      const {
        isStock
      } = this.properties;
      if (!isStock) return;
      this.triggerEvent('buyNow', {
        isAllSelectedSku,
      });
    },
    chooseSpec(e) {
      const {
        id
      } = e.currentTarget.dataset
      this.setData({
        selectedSku: id
      })
    },
    // 总处理
    setBuyNum(buyNum) {
      this.setData({
        buyNum,
      });
      this.triggerEvent('changeNum', {
        buyNum,
      });
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