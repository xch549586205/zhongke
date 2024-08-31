interface Screen {
  authorityId: string;
}
interface State {
  screen: Screen;
  allAuthorityList: Array<any>;
}

export default {
  namespaced: true,
  state: () =>
    <State>{
      screen: <Screen>{
        authorityId: "",
      },
      allAuthorityList: [],
    },
  mutations: {
    updateScreen(state: State, payload: { key: Screen; value: any }) {
      // 这里的 `state` 对象是模块的局部状态
      const { key, value } = payload;
      state.screen[key] = value;
    },
    updateAllAuthorityList(state: State, allAuthorityList: Array<any>) {
      state.allAuthorityList = allAuthorityList;
    },
  },
};
