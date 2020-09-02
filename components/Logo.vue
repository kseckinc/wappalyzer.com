<template>
  <nuxt-link to="/">
    <LogoDark v-if="dark" alt="Wappalyzer" class="logo d-block" height="100%" />
    <LogoLight v-else alt="Wappalyzer" class="logo d-block" height="100%" />
  </nuxt-link>
</template>

<script>
import LogoDark from '~/assets/images/logo/dark.svg?inline'
import LogoLight from '~/assets/images/logo/light.svg?inline'

export default {
  components: {
    LogoDark,
    LogoLight,
  },
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
