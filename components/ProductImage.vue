<template>
  <component :is="images[name]" class="product-image__image" />
</template>

<script>
import ImageLookup from '~/assets/images/lookup.svg?inline'
import ImageList from '~/assets/images/list.svg?inline'
import ImageAPI from '~/assets/images/api.svg?inline'
import ImageAlerts from '~/assets/images/alerts.svg?inline'
import ImageVerify from '~/assets/images/verify.svg?inline'

export default {
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      images: {
        'lookup.svg': ImageLookup,
        'list.svg': ImageList,
        'api.svg': ImageAPI,
        'alerts.svg': ImageAlerts,
        'verify.svg': ImageVerify,
      },
    }
  },
}
</script>

<style>
.product-image__image {
  max-width: 100%;
  height: auto;
}
</style>
