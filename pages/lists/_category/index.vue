<template>
  <div />
</template>

<script>
export default {
  fetch({ app, store, params }) {
    store.commit('lists/setCategorySlug', params.category)

    app.router.push('/lists')
  },
  created() {
    this.$router.replace('/lists')
  },
}
</script>
