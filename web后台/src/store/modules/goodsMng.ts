interface Screen {
  online: number;
  deviceName: string;
  siteName: string;
}
interface State {
  screen: Screen;
}

export default {
  namespaced: true,
  state: () =>
    <State>{
      screen: <Screen>{
        online: 0,
        deviceName: "",
        siteName: "",
      },
    },
  mutations: {
    updateScreen(state: State, payload: { key: Screen; value: any }) {
      // 这里的 `state` 对象是模块的局部状态
      const { key, value } = payload;
      state.screen[key] = value;
    },
  },
  getters: {
    online(state: { screen: Screen }) {
      return state.screen.online;
    },
  },
};
