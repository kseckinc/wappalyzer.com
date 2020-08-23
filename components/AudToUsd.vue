<template>
  <span v-if="exchangeRate" class="text--disabled">
    (approx.
    {{ formatCurrency((aud * exchangeRate) / 100, 'USD') }})
  </span>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    aud: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState({
      exchangeRate: ({ rate: { exchangeRate } }) => exchangeRate,
    }),
  },
  created() {
    this.getRate()
  },
  methods: {
    ...mapActions({
      getRate: 'rate/get',
    }),
  },
}
</script>
