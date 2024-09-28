import {
  getGoodsTypeListApi,
  searchGoodsApi
} from "../../../services/goods.js"
import {
  behavior
} from "miniprogram-computed"
import {
  baseUrl
} from "../../../services/http"
const image = 'https://tdesign.gtimg.com/mobile/demos/example2.png';
const items = new Array(12).fill({
  label: '标题文字',
  image
}, 0, 12);

Page({
  behaviors: [behavior],
  offsetTopList: [],
  data: {
    goodsList: [],
    goodsTypeList: [],
    sideBarIndex: 1,
    scrollTop: 0,
    height: 0,
  },
  onShow() {
    this.getTabBar().init();
  },
  computed: {
    categories(data) {
      const {
        goodsList,
        goodsTypeList
      } = data

      if (!goodsList.length || !goodsTypeList.length) {
        return []
      }
      const categories = goodsTypeList.map(goodsType => {
        const items = goodsList.filter(g => g.goodsTypeId === goodsType.id).map(goods => ({
          ...goods,
          label: goods.name,
          image: goods.goodsBanners && goods.goodsBanners.length ? baseUrl + '/' + goods.goodsBanners[0].url : ''
        }))
        return {
          ...goodsType,
          label: goodsType.name,
          title: goodsType.name,
          items
        }
      })
      return [{
          label: '全部',
          title: '',
          items: []
        },
        ...categories
      ]
    }
  },
  goGoodsDetail(e) {

    const {
      id
    } = e.currentTarget.dataset
    console.log(id)
    wx.navigateTo({
      url: '/pages/category/goodsDetail/goodsDetail?goodsId=' + id
    });
  },
  async onLoad() {
    this.getGoodsTypeList()
    await this.searchGoods()
    this.setData({
      height: wx.getWindowInfo().windowHeight - wx.getWindowInfo().screenTop
    })
    const query = wx.createSelectorQuery().in(this);
    const {
      sideBarIndex
    } = this.data;
    query.selectAll('.title').boundingClientRect();
    query.select('.custom-navbar').boundingClientRect();
    query.exec((res) => {
      const rects = res[0];
      this.offsetTopList = rects.map((item) => item.top);
      this.setData({
        scrollTop: this.offsetTopList[sideBarIndex]
      });
    });
  },
  async getGoodsTypeList() {
    try {
      const res = await getGoodsTypeListApi({
        page: 1,
        pageSize: 1000
      })
      this.setData({
        goodsTypeList: res.list
      })
    } catch (error) {
      console.error(error)
      this.setData({
        goodsTypeList: []
      })
    }
  },
  async searchGoods() {
    try {
      const res = await searchGoodsApi({
        page: 1,
        pageSize: 1000
      })
      this.setData({
        goodsList: res.list
      })
    } catch (error) {
      console.error(error)
      this.setData({
        goodsList: []
      })
    }
  },
  onSideBarChange(e) {
    const {
      value
    } = e.detail;
    if (value === 0) {
      return
    }
    this.setData({
      sideBarIndex: value,
      scrollTop: this.offsetTopList[value]
    });
  },
  onScroll(e) {
    const {
      scrollTop
    } = e.detail;
    const threshold = 50; // 下一个标题与顶部的距离
    if (scrollTop < threshold) {
      this.setData({
        sideBarIndex: 1
      });
      return;
    }

    const index = this.offsetTopList.findIndex((top) => top > scrollTop && top - scrollTop <= threshold);

    if (index > -1) {
      this.setData({
        sideBarIndex: index
      });
    }
  },
});