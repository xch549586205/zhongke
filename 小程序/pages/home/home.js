import {
  fetchHome
} from '../../services/home/home';
import {
  baseUrl
} from "../../services/http"
import {
  fetchGoodsList
} from '../../services/good/fetchGoods';
import {
  getDistance
} from "../../utils/util";
import Toast from 'tdesign-miniprogram/toast/index';
import {
  behavior
} from "miniprogram-computed"
import {
  getBannerListApi,
  getCategoryContentListApi,
  getCategoryListApi
} from "../../services/home.js"

const app = getApp();

Page({
  behaviors: [behavior],
  data: {
    categoryList: [],
    categoryContentList: [],
    bannerList: [],
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
    this.init();
    this.getTabBar().init();
  },

  onLoad() {},

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
    },
    procect(data) {
      const {
        categoryList,
        categoryContentList
      } = data
      if (!categoryList || !categoryList.length) {
        return []
      }
      let list = []
      categoryList.map(category => {
        list.push({
          categoryName: category.name,
          categoryContentList: categoryContentList.filter((categoryContent => categoryContent.categoryId === category.id))
        })
      })
      console.log(list)
      return list
    }
  },



  async init() {
    this.loadHomePage();
    this.getLocation();
    this.getBannerList()
    await this.getCategoryList();
    this.getCategoryContentList()
  },


  async getBannerList() {
    try {
      const res = await getBannerListApi({
        page: 1,
        pageSize: 1000
      })
      if (!res.list) {
        return []
      }
      this.setData({
        bannerList: res.list.map(banner => ({
          ...banner,
          url: baseUrl + '/' + banner.url
        })) || []
      })
    } catch (error) {
      console.error(error)
      this.setData({
        bannerList: []
      })
    }
  },
  async getCategoryList() {
    try {
      const res = await getCategoryListApi({
        page: 1,
        pageSize: 1000
      })
      if (!res.list) {
        return []
      }
      this.setData({
        categoryList: res.list
      })
    } catch (error) {
      console.error(error)
      this.setData({
        categoryList: []
      })
    }
  },
  async getCategoryContentList() {
    try {
      const res = await getCategoryContentListApi({
        page: 1,
        pageSize: 1000
      })
      if (!res.list) {
        return []
      }
      this.setData({
        categoryContentList: res.list.map(categoryContent => ({
          ...categoryContent,
          categoryBanner: categoryContent.categoryBanner.map(b => ({
            ...b,
            url: baseUrl + '/' + b.url
          })),
          detailBanner: categoryContent.categoryBanner.map(d => ({
            ...d,
            url: baseUrl + '/' + d.url
          }))
        })) || []
      })
    } catch (error) {
      console.error(error)
      this.setData({
        categoryContentList: []
      })
    }
  },

  async getLocation() {
    const that = this;
    if (this.data.location.latitude) {
      return
    }
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
  navToLoginPage() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  navToSearchPage() {
    wx.navigateTo({
      url: '/pages/category/search/index'
    });
  },
  goCategoryContent(e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/home/categoryContent/categoryContent?id=' + id
    });
  },

});