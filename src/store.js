import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      id: null,
      name: null,
      status: 0 // 0为正常 1为异常
    }
  },
  mutations: {
    setInfo (state, bindInfo) {
      state.userInfo.id = bindInfo.id
      state.userInfo.name = bindInfo.name
    }
  }
})
