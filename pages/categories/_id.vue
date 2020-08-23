<template>
  <div />
</template>

<script>
export default {
  asyncData({ redirect, route }) {
    redirect(`/technologies/${route.params.id}`)
  },
}
</script>
