export const state = () => ({
  isHero: true,
  isSecure: false
})

export const mutations = {
  hero(state, isHero) {
    state.isHero = isHero
  },
  secure(state, isSecure) {
    state.isSecure = isSecure
  }
}

export const actions = {
  set: ({ commit }, attrs) =>
    ['hero', 'secure'].forEach((attr) => commit(attr, attrs[attr] || false))
}
