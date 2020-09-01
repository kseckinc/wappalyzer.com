export const state = () => ({
  hero: true,
  isSecure: false,
})

export const mutations = {
  hero(state, hero) {
    state.hero = hero
  },
  secure(state, isSecure) {
    state.isSecure = isSecure
  },
}

export const actions = {
  set: ({ commit }, attrs) =>
    ['hero', 'secure'].forEach((attr) => commit(attr, attrs[attr])),
}
