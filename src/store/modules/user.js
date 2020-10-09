export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    homeUrl: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateHomeUrl (state, homeUrl) {
      state.homeUrl = homeUrl
    }
  }
}
