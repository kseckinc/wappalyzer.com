<template>
  <div />
</template>

<script>
export default {
  fetch({ app, store, params }) {
    store.commit('lists/setCategorySlug', params.category)
    store.commit('lists/setTechnologySlug', params.slug)

    app.router.push('/lists')
  },
  created() {
    this.$router.replace('/lists')
  }
}
</script>
