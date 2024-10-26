import { getGoodsTagListApi } from '@/api/goods.ts'

interface Screen {
  goodsTypeId: number | null
  name: string
  id: number | null
}
interface State {
  screen: Screen
  goodsTagList: Array<GoodsTag>
}
interface GoodsTag {
  sort: number
  name: string
}
export default {
  namespaced: true,
  state: () =>
    <State>{
      screen: <Screen>{
        goodsTypeId: null,
        name: '',
        id: null
      },
      goodsTagList: <Array<GoodsTag>>[]
    },
  mutations: {
    updateScreen(state: State, payload: { key: Screen; value: any }) {
      // 这里的 `state` 对象是模块的局部状态
      const { key, value } = payload
      state.screen[key] = value
    },
    updateAllGoodsTagList(state: State, payload: { goodsTagList: Array<GoodsTag> }) {
      state.goodsTagList = payload.goodsTagList
    },
    resetScreen(state: State, payload) {
      state.screen = {
        goodsTypeId: null,
        name: '',
        id: null
      }
    }
  },
  actions: {
    async getAllGoodsTagList({ commit }) {
      try {
        const res: any = await getGoodsTagListApi({
          page: 1,
          pageSize: 999999
        })
        if (!res.data.list) {
          return []
        }
        const goodsTagList: Array<GoodsTag> = [...res.data.list]
        commit('updateAllGoodsTagList', { goodsTagList })
      } catch (error) {
        console.error(error)
      }
    }
  },
  getters: {}
}
