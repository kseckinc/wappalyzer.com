export const state = () => ({
  credits: null,
  freeLists: { total: null, remaining: null, availableAt: null },
})

export const mutations = {
  setCredits(state, credits) {
    state.credits = credits
  },
  setFreeLists(state, freeLists) {
    state.freeLists = freeLists
  },
}

export const actions = {
  async get({ state, commit, dispatch }, attributes) {
    try {
      const { credits, freeLists } = (await this.$axios.get('credits')).data

      commit('setCredits', credits)
      commit('setFreeLists', freeLists)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      commit('setCredits', 0)
      commit('setFreeLists', { total: 0, remaining: 0, availableAt: null })
    }
  },
}
