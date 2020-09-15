<template>
  <span class="d-flex align-center">
    <component :is="cards[brand]" class="card__image flex-grow-0 mr-2" />
    <code class="mr-2"
      >&centerdot;&centerdot;&centerdot;&centerdot; {{ last4 }}</code
    >
    <code
      >{{ `0${expMonth}`.slice(-2) }}/{{ expYear.toString().slice(-2) }}</code
    >
  </span>
</template>

<script>
import amex from '~/assets/images/cards/amex.svg?inline'
import diners from '~/assets/images/cards/diners.svg?inline'
import discover from '~/assets/images/cards/discover.svg?inline'
import jcb from '~/assets/images/cards/jcb.svg?inline'
import mastercard from '~/assets/images/cards/mastercard.svg?inline'
import visa from '~/assets/images/cards/visa.svg?inline'

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
  data() {
    return {
      cards: {
        amex,
        diners,
        discover,
        jcb,
        mastercard,
        visa,
      },
    }
  },
}
</script>

<style>
.card__image {
  width: 32px;
}
</style>
