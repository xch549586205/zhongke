interface Screen {
  authorityId: string
}
interface State {
  screen: Screen
}

export default {
  namespaced: true,
  state: () =>
    <State>{
      screen: <Screen>{
        authorityId: ''
      }
    },
  mutations: {
    updateScreen(state: State, payload: { key: Screen; value: any }) {
      // 这里的 `state` 对象是模块的局部状态
      const { key, value } = payload
      state.screen[key] = value
    }
  }
}
