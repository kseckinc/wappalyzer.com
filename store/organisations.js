export const state = () => ({
  memberOf: [],
})

export const mutations = {
  setMemberOf(state, memberOf) {
    state.memberOf = [...memberOf]
  },
}

export const actions = {
  async get({ commit }) {
    const memberOf = (await this.$axios.get('organisation/memberof')).data

    commit('setMemberOf', memberOf)
  },
  set({ commit }, memberOf) {
    commit('setMemberOf', memberOf)
  },
}
