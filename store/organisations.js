export const state = () => ({
  memberOf: [],
})

export const mutations = {
  setMemberOf(state, memberOf) {
    state.memberOf = [...memberOf]
  },
}

export const actions = {
  async get({ state, commit, dispatch }, attributes) {
    const memberOf = (await this.$axios.get('organisation/memberof')).data

    commit('setMemberOf', memberOf)
  },
}
