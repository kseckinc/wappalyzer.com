export const state = () => ({
  categorySlug: false,
  technologySlug: false
})

export const mutations = {
  setCategorySlug(state, categorySlug) {
    state.categorySlug = categorySlug
  },
  setTechnologySlug(state, technologySlug) {
    state.technologySlug = technologySlug
  }
}
