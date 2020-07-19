export const state = () => ({
  exchangeRate: 0
})

export const mutations = {
  set(state, rate) {
    state.exchangeRate = rate
  }
}

export const actions = {
  async get({ state, commit, dispatch }, attributes) {
    if (!state.rate) {
      const rate = (await this.$axios.get('rate')).data

      commit('set', rate)
    }
  }
}
