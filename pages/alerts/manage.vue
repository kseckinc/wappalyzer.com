<template>
  <div />
</template>

<script>
export default {
  created() {
    const { url } = this.$route.query

    this.$router.push({ path: '/alerts', query: { url } })
  },
}
</script>
