import Toast from 'tdesign-miniprogram/toast/index';
import {
  resolveAddress,
  rejectAddress
} from './util';
import {
  getAddressPromise
} from '../edit/util';
import {
  addUserAddrApi,
  deleteUserAddrApi,
  getUserAddrListApi
} from "@/services/address"
const app = getApp()
Page({
  data: {
    addressList: [],
    deleteID: '',
    showDeleteConfirm: false,
    selectMode: false,
    isOrderSure: false,
  },

  /** 选择模式 */
  /** 是否已经选择地址，不置为true的话页面离开时会触发取消选择行为 */
  hasSelect: false,

  onLoad(query) {
    const {
      selectMode = ''
    } = query;
    this.setData({
      selectMode: Boolean(selectMode)
    })
    // this.init();
  },
  onShow() {
    this.init();

  },
  init() {
    this.getAddressList();
  },
  onUnload() {
    // if (this.selectMode && !this.hasSelect) {
    //   rejectAddress();
    // }
  },

  async getAddressList() {
    const {
      id
    } = this.data;
    const userInfo = wx.getStorageSync("userInfo")
    const res = await getUserAddrListApi({
      id: userInfo.id
    })
    app.globalData.userAddr = res.user.userAddr
    const pages = getCurrentPages(); // 获取当前页面栈
    const prevPage = pages[pages.length - 1 - 1]; // 目标页面
    if (this.data.selectMode && res.user.userAddr.findIndex(addr => addr.id === prevPage.data.addrId) === -1) {
      // 如果上个页面选中的地址没有了（被删了） ，上个页面选中的地址要清空
      prevPage.setData({
        addrId: ''
      });
    }
    this.setData({
      addressList: res.user.userAddr.map(addr => {
        return {
          ...addr,
          countryName: addr.country,
          provinceName: addr.province,
          cityName: addr.city,
          districtName: addr.area,
          isDefault: res.user.defaultAddrId === addr.id,
          name: addr.userName,
          phone: addr.phoneNumber,
          address: `${ addr.province}${addr.city}${addr.area} ${addr.detail}`
        }
      })
    })

  },
  getWXAddressHandle() {
    wx.chooseAddress({
      success: (res) => {
        if (res.errMsg.indexOf('ok') === -1) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: res.errMsg,
            icon: '',
            duration: 1000,
          });
          return;
        }
        Toast({
          context: this,
          selector: '#t-toast',
          message: '添加成功',
          icon: '',
          duration: 1000,
        });
        const {
          length: len
        } = this.data.addressList;
        this.setData({
          [`addressList[${len}]`]: {
            name: res.userName,
            phoneNumber: res.telNumber,
            address: `${res.provinceName}${res.cityName}${res.countryName}${res.detailInfo}`,
            isDefault: 0,
            tag: '微信地址',
            id: len,
          },
        });
      },
    });
  },
  confirmDeleteHandle({
    detail
  }) {
    const {
      id
    } = detail || {};
    if (id !== undefined) {
      this.setData({
        deleteID: id,
        showDeleteConfirm: true
      });
      Toast({
        context: this,
        selector: '#t-toast',
        message: '地址删除成功',
        theme: 'success',
        duration: 1000,
      });
    } else {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '需要组件库发新版才能拿到地址ID',
        icon: '',
        duration: 1000,
      });
    }
  },
  async deleteAddressHandle(e) {
    const {
      id
    } = e.currentTarget.dataset;
    const userInfo = wx.getStorageSync("userInfo")
    const res = await deleteUserAddrApi({
      id,
      userId: userInfo.id
    })
    this.getAddressList()
    this.setData({
      deleteID: '',
      showDeleteConfirm: false,
    });
  },
  editAddressHandle({
    detail
  }) {
    // this.waitForNewAddress();
    const {
      id
    } = detail || {};
    wx.navigateTo({
      url: `/pages/usercenter/address/edit/index?id=${id}`
    });
  },
  selectHandle({
    detail
  }) {
    if (this.data.selectMode) {
      this.hasSelect = true;
      // resolveAddress(detail);
      const pages = getCurrentPages(); // 获取当前页面栈
      const prevPage = pages[pages.length - 1 - 1]; // 目标页面
      prevPage.setData({
        addrId: detail.id
      });
      wx.navigateBack({
        delta: 1
      });
    } else {
      this.editAddressHandle({
        detail
      });
    }
  },
  createHandle() {
    this.waitForNewAddress();
    wx.navigateTo({
      url: '/pages/usercenter/address/edit/index'
    });
  },

  waitForNewAddress() {
    getAddressPromise()
      .then((newAddress) => {
        let addressList = [...this.data.addressList];

        newAddress.phoneNumber = newAddress.phone;
        newAddress.address = `${newAddress.provinceName}${newAddress.cityName}${newAddress.districtName}${newAddress.detailAddress}`;
        newAddress.tag = newAddress.addressTag;

        if (!newAddress.addressId) {
          newAddress.id = `${addressList.length}`;
          newAddress.addressId = `${addressList.length}`;

          if (newAddress.isDefault === 1) {
            addressList = addressList.map((address) => {
              address.isDefault = 0;

              return address;
            });
          } else {
            newAddress.isDefault = 0;
          }

          addressList.push(newAddress);
        } else {
          addressList = addressList.map((address) => {
            if (address.addressId === newAddress.addressId) {
              return newAddress;
            }
            return address;
          });
        }

        addressList.sort((prevAddress, nextAddress) => {
          if (prevAddress.isDefault && !nextAddress.isDefault) {
            return -1;
          }
          if (!prevAddress.isDefault && nextAddress.isDefault) {
            return 1;
          }
          return 0;
        });

        this.setData({
          addressList: addressList,
        });
      })
      .catch((e) => {
        if (e.message !== 'cancel') {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '地址编辑发生错误',
            icon: '',
            duration: 1000,
          });
        }
      });
  },
});