<template>
  <v-img :src="`/images/products/${name}.png`" width="100%" contain />
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
  },
}
</script>

<style>
.product-image__image {
  max-width: 100%;
  height: auto;
}
</style>
