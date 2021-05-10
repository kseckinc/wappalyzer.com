<template>
  <v-btn
    class="spinner ml-n1"
    icon
    x-small
    loading
    :disabled="!color"
    :color="color"
  />
</template>

<script>
import { mdiAutorenew } from '@mdi/js'

export default {
  props: {
    color: {
      type: String,
      default: 'grey',
    },
  },
  data() {
    return { mdiAutorenew }
  },
}
</script>
