interface Screen {
  siteName: string;
  province: string;
  city: string;
  county: string;
}
interface State {
  screen: Screen;
}

export default {
  namespaced: true,
  state: () =>
    <State>{
      screen: <Screen>{
        siteName: "",
        province: "",
        city: "",
        county: "",
      },
    },
  mutations: {
    updateScreen(state: State, payload: { key: Screen; value: any }) {
      // 这里的 `state` 对象是模块的局部状态
      const { key, value } = payload;
      state.screen[key] = value;
    },
  },
};
