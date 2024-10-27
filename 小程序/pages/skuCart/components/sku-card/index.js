Component({

  properties: {
    sku: {
      type: Object,
      observer(sku) {
        this.setData({
          sku,
        });
      },
    },
  },

  data: {
    sku: {},
    right: [{
      text: '删除',
      className: 'delete-btn',
    }, ],
  },

  methods: {
    onSelectClick() {
      this.triggerEvent('selectClick', this.data.sku.id);
    },
    specClick() {
      this.triggerEvent('openChangeSkuPopup', {
        sku: this.data.sku
      });
    },
    onDeleteClick() {
      this.triggerEvent('deleteSkuFormCar', this.data.sku.id);
    },
    handleSkuNumberChange(e) {
      const {
        value
      } = e.detail;
      this.triggerEvent('upateCartSkuNum', {
        id: this.data.sku.id,
        skuNum: value
      });
    },



    clickHandle() {
      this.triggerEvent('click', {
        goods: this.data.goods
      });
    },
    clickThumbHandle() {
      this.triggerEvent('thumb', {
        goods: this.data.goods
      });
    },
    clickSpecsHandle() {
      this.triggerEvent('specs', {
        goods: this.data.goods
      });
    },
    clickTagHandle(evt) {
      const {
        index
      } = evt.currentTarget.dataset;
      this.triggerEvent('tag', {
        goods: this.data.goods,
        index
      });
    },
    // 加入购物车
    addCartHandle(e) {
      const {
        id
      } = e.currentTarget;
      const {
        id: cardID
      } = e.currentTarget.dataset;
      this.triggerEvent('add-cart', {
        ...e.detail,
        id,
        cardID,
        goods: this.data.goods,
      });
    },
    genIndependentID(id, cb) {
      let independentID;
      if (id) {
        independentID = id;
      } else {
        independentID = `goods-card-${~~(Math.random() * 10 ** 8)}`;
      }
      this.setData({
        independentID
      }, cb);
    },

    init() {
      const {
        thresholds,
        id,
        hidden
      } = this.properties;
      if (hidden !== null) {
        this.setHidden(!!hidden);
      }

      this.genIndependentID(id || '', () => {
        if (thresholds && thresholds.length) {
          this.createIntersectionObserverHandle();
        }
      });
    },

    clear() {
      this.clearIntersectionObserverHandle();
    },

    setHidden(hidden) {
      this.setData({
        hiddenInData: !!hidden
      });
    },

    createIntersectionObserverHandle() {
      if (this.intersectionObserverContext || !this.data.independentID) {
        return;
      }

      this.intersectionObserverContext = wx
        .createIntersectionObserver(this, {
          thresholds: this.properties.thresholds,
        })
        .relativeToViewport();

      this.intersectionObserverContext.observe(
        `#${this.data.independentID}`,
        (res) => {
          this.intersectionObserverCB(res);
        },
      );
    },
    intersectionObserverCB(ob) {
      this.triggerEvent('ob', {
        goods: this.data.goods,
        context: this.intersectionObserverContext,
        ob,
      });
    },
    clearIntersectionObserverHandle() {
      if (this.intersectionObserverContext) {
        try {
          this.intersectionObserverContext.disconnect();
        } catch (e) {}

        this.intersectionObserverContext = null;
      }
    },
  },
});