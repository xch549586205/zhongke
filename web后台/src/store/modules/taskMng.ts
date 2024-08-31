interface Screen {
  username: string;
  name: string;
  typeName: string;
  statusName: string;
}
interface State {
  screen: Screen;
}

export default {
  namespaced: true,
  state: () =>
    <State>{
      screen: <Screen>{
        username: "",
        name: "",
        typeName: "",
        statusName: "",
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
