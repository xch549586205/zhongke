import {
  OrderStatus
} from './config';
import {
  baseUrl
} from "@/services/http"
import {
  getTotalAmount,
  getPriceByAuthorityId
} from "@/utils/mydecimal.js"
import {
  fetchOrders,
  fetchOrdersCount,
} from '../../services/order/orderList';
import {
  getOrderListApi
} from "../../services/order"
import {
  cosThumb
} from '../../utils/util';
import {
  orderTagInfos
} from '../usercenter/index'
Page({
  page: {
    size: 7,
    num: 1,
  },
  data: {
    tabs: [{
        key: [],
        text: '全部'
      },
      {
        key: OrderStatus.PENDING_PAYMENT,
        text: '待付款',
        info: ''
      },
      {
        key: OrderStatus.PENDING_DELIVERY,
        text: '待发货',
        info: ''
      },
      {
        key: OrderStatus.PENDING_RECEIPT,
        text: '待收货',
        info: ''
      },
      {
        key: OrderStatus.COMPLETE,
        text: '已完成',
        info: ''
      }, {
        key: OrderStatus.AFTER,
        text: '售后',
        info: ''
      },
    ],
    curTab: -1,
    orderList: [],
    listLoading: 0,
    pullDownRefreshing: false,
    backRefresh: false,
    status: [],
  },

  onLoad(query) {
    const {
      tabType
    } = query
    const typeForStatus = {
      1: [1],
      2: [2],
      3: [3],
      4: [4],
      5: [5, 6],
    }
    let status = []
    if (tabType) {
      status = typeForStatus[tabType]
      this.setData({
        status
      })
    }
    this.init(status);
    this.pullDownRefresh = this.selectComponent('#wr-pull-down-refresh');
  },

  onShow() {
    if (!this.data.backRefresh) return;
    this.onRefresh();
    this.setData({
      backRefresh: false
    });
  },

  onReachBottom() {
    if (this.data.listLoading === 0) {
      this.getOrderList(this.data.curTab);
    }
  },

  onPageScroll(e) {
    this.pullDownRefresh && this.pullDownRefresh.onPageScroll(e);
  },

  onPullDownRefresh_(e) {
    this.setData({
      pullDownRefreshing: true
    });
    this.refreshList(this.data.curTab)
      .then(() => {
        this.setData({
          pullDownRefreshing: false
        });
      })
      .catch((err) => {
        this.setData({
          pullDownRefreshing: false
        });
        Promise.reject(err);
      });
  },

  init(status) {
    status = status !== undefined ? status : this.data.curTab;
    this.setData({
      status,
    });
    this.refreshList(status);
  },

  getOrderList(orderStatusId = [], reset = false) {
    const params = {
      page: this.page.num,
      pageSize: this.page.size,
    };
    if (orderStatusId !== []) params.orderStatusId = orderStatusId;
    this.setData({
      listLoading: 1
    });
    return getOrderListApi(params)
      .then((res) => {
        this.page.num++;
        let orderList = [];
        if (res && res.list) {
          orderList = (res.list || []).map((order) => {
            return {
              id: order.id,
              orderNo: order.id,
              status: order.orderStatus.name,
              statusDesc: order.orderStatus.name,
              totalAmount: getTotalAmount(order.orderSku),
              skuList: (order.orderSku || []).map((goods) => ({
                id: goods.id,
                thumb: baseUrl + "/" + goods.sku.zkGoods.goodsBanners[0].url,
                title: goods.sku.zkGoods.name,
                skuId: goods.skuId,
                specs: [goods.sku.specName],
                price: getPriceByAuthorityId(goods.sku.skuPrice),
                num: goods.skuNum,
                titlePrefixTags: goods.tagText ? [{
                  text: goods.tagText
                }] : [],
              })),
              buttons: [],
              freightFee: 0,
            };
          });
        }
        return new Promise((resolve) => {
          if (reset) {
            this.setData({
              orderList: []
            }, () => resolve());
          } else resolve();
        }).then(() => {
          this.setData({
            orderList: this.data.orderList.concat(orderList),
            listLoading: orderList.length > 0 ? 0 : 2,
          });
        });
      })
      .catch((err) => {
        this.setData({
          listLoading: 3
        });
        return Promise.reject(err);
      });
  },



  onReTryLoad() {
    this.getOrderList(this.data.curTab);
  },

  onTabChange(e) {
    const {
      value
    } = e.detail;
    this.setData({
      status: value,
    });
    this.refreshList(value);
  },

  getOrdersCount() {
    return fetchOrdersCount().then((res) => {
      const tabsCount = res.data || [];
      const {
        tabs
      } = this.data;
      tabs.forEach((tab) => {
        const tabCount = tabsCount.find((c) => c.tabType === tab.key);
        if (tabCount) {
          tab.info = tabCount.orderNum;
        }
      });
      this.setData({
        tabs
      });
    });
  },

  refreshList(status = []) {
    this.page = {
      size: this.page.size,
      num: 1,
    };
    this.setData({
      curTab: status,
      orderList: []
    });

    return Promise.all([
      this.getOrderList(status, true),
      this.getOrdersCount(),
    ]);
  },

  onRefresh() {
    this.refreshList(this.data.curTab);
  },

  onOrderCardTap(e) {
    const {
      order
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${order.id}`,
    });
  },
});