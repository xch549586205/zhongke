import Toast from 'tdesign-miniprogram/toast/index';
import {
  getOrderNumApi
} from "@/services/order"
const menuData = [
  [{
      title: '收货地址',
      tit: '',
      url: '',
      type: 'address',
    },
    // {
    //   title: '优惠券',
    //   tit: '',
    //   url: '',
    //   type: 'coupon',
    // },
    {
      title: '邀请合作伙伴',
      tit: '',
      url: '/pages/applyDealer/applyDealer',
      type: 'applyDealer',
    },
    // {
    //   title: '积分',
    //   tit: '',
    //   url: '',
    //   type: 'point',
    // },
  ],
  [
    // {
    //   title: '帮助中心',
    //   tit: '',
    //   url: '',
    //   type: 'help-center',
    // },
    {
      title: '客服热线',
      tit: '',
      url: '',
      type: 'service',
      icon: 'service',
    },
  ],
];

export const orderTagInfos = [{
    title: '待付款',
    iconName: 'wallet',
    orderNum: 0,
    tabType: 1,
    status: [1],
  },
  {
    title: '待发货',
    iconName: 'deliver',
    orderNum: 0,
    tabType: 2,
    status: [2],
  },
  {
    title: '待收货',
    iconName: 'package',
    orderNum: 0,
    tabType: 3,
    status: [3],
  },
  {
    title: '已完成',
    iconName: 'comment',
    orderNum: 0,
    tabType: 4,
    status: [4],
  },
  {
    title: '退款/售后',
    iconName: 'exchang',
    orderNum: 0,
    tabType: 5,
    status: [5, 6],
  },
];
const userInfo = wx.getStorageSync("userInfo") || {}
const getDefaultData = () => ({
  showMakePhone: false,
  userInfo: {
    ...userInfo,
    nickName: userInfo.userName
  },
  menuData,
  orderTagInfos,
  customerServiceInfo: {
    servicePhone: "4006336868",
    serviceTimeDuration: "每周三至周五 9:00-12:00  13:00-15:00"
  },
  currAuthStep: Object.keys(userInfo).length ? 2 : 1,
  showKefu: true,
  versionNo: '',
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.getVersionInfo();
  },

  onShow() {
    this.getOrderNum()
    this.getTabBar().init();
    this.init();
  },
  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.fetUseriInfoHandle();
  },

  fetUseriInfoHandle() {

  },
  async getOrderNum() {
    const userInfo = wx.getStorageSync("userInfo")
    const res = await getOrderNumApi({
      userId: userInfo.id
    })
    const {
      orderStateNum
    } = res.data
    if (orderStateNum && orderStateNum.length) {
      let newOrderTagInfos = [...this.data.orderTagInfos]
      newOrderTagInfos = newOrderTagInfos.map(tag => {
        const {
          status
        } = tag
        const orderStateNumByFilterStatus = orderStateNum.filter(os => status.indexOf(os.orderStatusId) !== -1)
        const orderNum = orderStateNumByFilterStatus.reduce((oneElement, twoElement) => {
          return oneElement + twoElement.num
        }, 0)
        return {
          ...tag,
          orderNum
        }
      })
      this.setData({
        orderTagInfos: newOrderTagInfos
      })
    }
  },
  onClickCell({
    currentTarget
  }) {
    const {
      type
    } = currentTarget.dataset;

    switch (type) {
      case 'address': {
        wx.navigateTo({
          url: '/pages/usercenter/address/list/index'
        });
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'help-center': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了帮助中心',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'point': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了积分菜单',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'coupon': {
        wx.navigateTo({
          url: '/pages/coupon/coupon-list/index'
        });
        break;
      }
      case 'applyDealer': {
        wx.navigateTo({
          url: '/pages/applyDealer/applyDealer'
        });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  jumpNav(e) {
    const tabType = e.detail.tabType;
    wx.navigateTo({
      url: `/pages/orderList/orderList?tabType=${tabType}`
    });
  },

  jumpAllOrder() {
    wx.navigateTo({
      url: '/pages/orderList/orderList'
    });
  },

  openMakePhone() {
    this.setData({
      showMakePhone: true
    });
  },

  closeMakePhone() {
    this.setData({
      showMakePhone: false
    });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  gotoUserEditPage() {
    return
    const {
      currAuthStep
    } = this.data;
    if (currAuthStep === 2) {
      wx.navigateTo({
        url: '/pages/usercenter/person-info/index'
      });
    }
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const {
      version,
      envVersion = __wxConfig
    } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});