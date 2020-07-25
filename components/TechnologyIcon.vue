<template>
  <v-avatar color="secondary elevation-1 mr-2" size="32">
    <div class="d-flex">
      <v-img
        :src="`/images/icons/${icon}`"
        class="d-inline-block"
        contain
        max-height="16"
        max-width="16"
      />
    </div>
  </v-avatar>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    small: {
      type: Boolean,
      default: false
    }
  }
}
</script>
