// pages/category/goodsDetail/components/goods-param-popup/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    goodsInfo: {
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlePopupHide() {
      this.triggerEvent('closeParamPopup');
    },

  }
})