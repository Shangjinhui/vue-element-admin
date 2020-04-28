
const state = {
  num: Math.ceil(Math.random() * 10)
}
const mutations = {
  ADD_NUM: (state, val) => {
    state.num = state.num + val
  },
  DEL_NUM: (state, val) => {
    state.num = state.num - val
  }
}

const actions = {
  changenum({ commit }, obj) {
    console.log(obj)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        obj.type === '+' ? commit('ADD_NUM', 1) : commit('DEL_NUM', 1)
        resolve()
      }, 1000)
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
