interface Screen {
  goodsTypeId: number | null
  name: string
  specName: string
  goodsId?: number | null
  goodsName?: string | null
  goodsStateId: number | null
  id: number | null
}
interface State {
  screen: Screen
}

export default {
  namespaced: true,
  state: () =>
    <State>{
      screen: <Screen>{
        goodsTypeId: null,
        name: '',
        id: null,
        goodsId: null,
        goodsName: '',
        specName: '',
        goodsStateId: null
      }
    },
  mutations: {
    updateScreen(state: State, payload: { key: Screen; value: any }) {
      // 这里的 `state` 对象是模块的局部状态
      const { key, value } = payload
      state.screen[key] = value
    },
    resetScreen(state: State, payload) {
      state.screen = {
        goodsTypeId: null,
        name: '',
        id: null,
        goodsId: null,
        goodsName: '',
        specName: '',
        goodsStateId: null
      }
    }
  },
  actions: {},
  getters: {}
}
