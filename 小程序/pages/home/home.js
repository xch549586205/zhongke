import {
  fetchHome
} from '../../services/home/home';
import {
  fetchGoodsList
} from '../../services/good/fetchGoods';
import {
  getDistance
} from "../../utils/util";
import Toast from 'tdesign-miniprogram/toast/index';
const computedBehavior = require("miniprogram-computed").behavior;

Page({
  behaviors: [computedBehavior],
  data: {
    imgSrcs: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: {
      type: 'dots'
    },
    swiperImageProps: {
      mode: 'scaleToFill'
    },
    location: {},
  },

  goodListPagination: {
    index: 0,
    num: 20,
  },

  privateData: {
    tabIndex: 0,
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },
  computed: {
    recent(data) {
      if (!data.location.latitude) {
        return ""
      }
      const zhongkeSite = {
        latitude: 24.615415,
        longitude: 118.085012,
      }
      const distance = getDistance(
        data.location.latitude,
        data.location.longitude,
        zhongkeSite.latitude,
        zhongkeSite.longitude
      );
      console.log(distance ? (distance / 1000).toFixed(1) + "km" : "")
      return distance ? (distance / 1000).toFixed(1) + "Km" : ""
    }
  },
  init() {
    this.loadHomePage();
    this.getLocation();
  },
  async getLocation() {
    const that = this;
    wx.getLocation({
      type: "wgs84",
      async success(res) {
        that.setData({
          location: res
        })
      },
      fail: function (error) {
        wx.showModal({
          title: '确认',
          content: '需要获取用户位置信息权限',
          confirmText: '前往设置',
          cancelText: '取消',
          confirmColor: "#3CC51F",
          success(res) {
            if (res.confirm) {
              wx.openSetting(); // 打开小程序设置页面，可以让用户开启需要的权限
            }
          },
        });
        console.error(error);
      },
    });
  },
  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });
    fetchHome().then(({
      swiper,
      tabList
    }) => {
      this.setData({
        tabList,
        imgSrcs: swiper,
        pageLoading: false,
      });
      this.loadGoodsList(true);
    });
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail;
    this.loadGoodsList(true);
  },

  onReTry() {
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({
      goodsListLoadStatus: 1
    });

    const pageSize = this.goodListPagination.num;
    let pageIndex = this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1;
    if (fresh) {
      pageIndex = 0;
    }

    try {
      const nextList = await fetchGoodsList(pageIndex, pageSize);
      this.setData({
        goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
        goodsListLoadStatus: 0,
      });

      this.goodListPagination.index = pageIndex;
      this.goodListPagination.num = pageSize;
    } catch (err) {
      this.setData({
        goodsListLoadStatus: 3
      });
    }
  },

  goodListClickHandle(e) {
    const {
      index
    } = e.detail;
    const {
      spuId
    } = this.data.goodsList[index];
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },

  goodListAddCartHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加入购物车',
    });
  },

  navToSearchPage() {
    wx.navigateTo({
      url: '/pages/goods/search/index'
    });
  },

  navToActivityDetail({
    detail
  }) {
    const {
      index: promotionID = 0
    } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
    });
  },
});