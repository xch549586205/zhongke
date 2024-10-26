interface Screen {
  authorityId: string
}

interface Screen1 {
  contactName: string
}
interface State {
  screen: Screen
  screen1: Screen1
}

export default {
  namespaced: true,
  state: () =>
    <State>{
      screen: <Screen>{
        authorityId: ''
      },
      screen1: <Screen1>{
        contactName: ''
      }
    },
  mutations: {
    updateScreen(state: State, payload: { key: Screen; value: any }) {
      // 这里的 `state` 对象是模块的局部状态
      const { key, value } = payload
      state.screen[key] = value
    },
    updateScreen1(state: State, payload: { key: Screen; value: any }) {
      // 这里的 `state` 对象是模块的局部状态
      const { key, value } = payload
      state.screen1[key] = value
    }
  }
}
