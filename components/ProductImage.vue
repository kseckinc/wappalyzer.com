<template>
  <component :is="images[name]" class="product-image__image" />
</template>

<script>
import ImageLookup from '~/assets/images/lookup.svg?inline'
import ImageList from '~/assets/images/list.svg?inline'
import ImageBulk from '~/assets/images/bulk.svg?inline'
import ImageAPI from '~/assets/images/api.svg?inline'
import ImageAlerts from '~/assets/images/alerts.svg?inline'
import ImageExtension from '~/assets/images/extension.svg?inline'
import ImageExtension2 from '~/assets/images/extension-2.svg?inline'

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
        'bulk.svg': ImageBulk,
        'api.svg': ImageAPI,
        'alerts.svg': ImageAlerts,
        'extension.svg': ImageExtension,
        'extension-2.svg': ImageExtension2,
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
