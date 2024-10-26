interface UserInfo {
  userName: string
  userId: string
}
interface State {
  userInfo: UserInfo
}

export default {
  namespaced: true,
  state: () =>
    <State>{
      userInfo: <UserInfo>{
        userName: '',
        userId: ''
      }
    },
  mutations: {
    updateUserInfo(state: State, payload: UserInfo) {
      state.userInfo.userName = payload.userName
      state.userInfo.userId = payload.userId
    }
  }
}
