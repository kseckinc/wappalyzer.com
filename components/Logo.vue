<template>
  <nuxt-link to="/">
    <img
      :src="`/images/logo/${dark ? 'dark' : 'light'}.svg`"
      alt="Wappalyzer"
      class="logo"
      height="100%"
    />
  </nuxt-link>
</template>

<script>
export default {
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
