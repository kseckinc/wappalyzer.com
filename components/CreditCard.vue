<template>
  <span class="d-flex align-center">
    <v-img
      :src="`/images/cards/${brand}.svg`"
      class="flex-grow-0 mr-2"
      width="32"
    />
    <code class="mr-2"
      >&centerdot;&centerdot;&centerdot;&centerdot; {{ last4 }}</code
    >
    <code
      >{{ `0${expMonth}`.slice(-2) }}/{{ expYear.toString().slice(-2) }}</code
    >
  </span>
</template>

<script>
export default {
  props: {
    brand: {
      type: String,
      default: '',
    },
    last4: {
      type: String,
      default: '',
    },
    expMonth: {
      type: Number,
      default: 0,
    },
    expYear: {
      type: Number,
      default: 0,
    },
  },
}
</script>
