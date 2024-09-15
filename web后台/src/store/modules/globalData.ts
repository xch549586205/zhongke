import { getGoodsTypeListApi } from '@/api/goodsType'
import { getAuthorityList } from '@/api/authority'

interface Authority {
  authorityId: string
  authorityName: string
}
interface GoodsType {
  name: string
  id: string
}
interface State {
  allAuthorityList: Array<Authority>
  goodsTypeList: Array<GoodsType>
}

export default {
  namespaced: true,
  state: () =>
    <State>{
      allAuthorityList: [],
      goodsTypeList: []
    },
  mutations: {
    updateAllAuthorityList(state: State, allAuthorityList: Array<any>) {
      state.allAuthorityList = allAuthorityList
    },
    updateGoodsTypeList(state: State, goodsTypeList: Array<any>) {
      state.goodsTypeList = goodsTypeList
    }
  },
  actions: {
    async getAllAuthorityList({ commit, state }) {
      const res: any = await getAuthorityList({
        page: 1,
        pageSize: 20000
      })
      const allAuthorityList = res.data.list
      commit('updateAllAuthorityList', allAuthorityList)
    },
    async getGoodsTypeList({ commit, state }) {
      const res: any = await getGoodsTypeListApi({
        page: 1,
        pageSize: 20000
      })
      const goodsTypeList = res.data.list
      commit('updateGoodsTypeList', goodsTypeList)
    }
  }
}
