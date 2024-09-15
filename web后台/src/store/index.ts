import goodsMng from './modules/goodsMng'
import siteMng from './modules/siteMng'
import taskMng from './modules/taskMng'
import userMng from './modules/userMng'
import globalData from './modules/globalData'
import { createStore } from 'vuex'

const store = createStore({
  state: () => ({ msg: 1 }),
  // 嵌套模块
  modules: {
    goodsMng,
    siteMng,
    taskMng,
    userMng,
    globalData
  }
})
export default store
