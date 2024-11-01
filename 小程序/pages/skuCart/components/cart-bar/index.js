Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isAllSelected: {
      type: Boolean,
      value: false,
    },
    totalAmount: {
      type: Number,
      value: 1,
    },
    disabledToSettle: {
      type: Boolean,
    },
    totalGoodsNum: {
      type: Number,
      value: 0,
    },
    totalDiscountAmount: {
      type: Number,
      value: 0,
    },
    bottomHeight: {
      type: Number,
      value: 100,
    },
    fixed: Boolean,
  },
  data: {},

  methods: {
    handleSelectAll() {
      const {
        isAllSelected
      } = this.data;
      this.setData({
        isAllSelected: !isAllSelected,
      });
      this.triggerEvent('handleSelectAll', {
        isAllSelected: isAllSelected,
      });
    },

    handleToSettle() {
      if (this.data.disabledToSettle) return;
      this.triggerEvent('handleToSettle');
    },
  },
});