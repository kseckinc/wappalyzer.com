import Vue from 'vue'

import { creditTiers } from '~/assets/json/pricing.json'

Vue.mixin({
  methods: {
    formatCurrency: (amount, currency = 'USD', decimal = false) =>
      `${amount.toLocaleString(
        currency.toUpperCase() === 'AUD' ? 'en-AU' : 'en-US',
        {
          style: 'currency',
          currency,
          minimumFractionDigits: decimal ? 2 : 0,
          maximumFractionDigits: decimal ? 3 : 0,
        }
      )} ${currency.toUpperCase() === 'AUD' ? currency.toUpperCase() : ''}`,
    formatDate: (date) =>
      date.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    formatNumber: (number, readable) => {
      if (typeof number !== 'number') {
        return ''
      }

      if (readable && number > 10) {
        const length = number.toString().length
        const half = Math.round(length / 2)

        number =
          number.toString().slice(0, half) +
          Array(Math.max(0, length - half + 1)).join(0)
      }

      return isNaN(parseFloat(number))
        ? ''
        : parseFloat(number).toLocaleString()
    },
    getErrorMessage(error) {
      if (error.response) {
        const code = error.response.data.code
          ? ` (reference ${error.response.data.code})`
          : ''

        switch (error.response.status) {
          case 401:
            return `You must be signed into access this item${code}`
          case 403:
            return `You don't have access this item${code}`
          case 404:
            return `Item not found${code}`
          case 409:
            return `Too many requests, please try again later${code}`
          default:
            return `${
              error.response.data.message || error.response.data
            }${code}`
        }
      } else {
        return error.message || error.toString()
      }
    },
    scrollToTop() {
      this.$nextTick(() =>
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
      )
    },
    centsToCredits(cents) {
      if (!cents) {
        return 0
      }

      const tiers = Object.keys(creditTiers).map((tier) => parseInt(tier, 10))

      let remaining = cents

      return Math.round(
        tiers.reduce((credits, tier, index) => {
          const price = this.creditTiers[tier]

          const diff = Math.min(
            remaining,
            price * (tier - (index ? tiers[index - 1] : 0))
          )

          credits += (index === tiers.length - 1 ? remaining : diff) / price

          remaining -= diff

          return credits
        }, 0)
      )
    },
    creditsToCents(credits) {
      if (!credits) {
        return 0
      }

      const tiers = Object.keys(creditTiers).map((tier) => parseInt(tier, 10))

      let remaining = credits

      return tiers.reduce((price, tier, index) => {
        const amount = tier - (index ? tiers[index - 1] : 0)

        const credits = Math.max(
          index === tiers.length - 1
            ? remaining
            : Math.min(amount, index ? remaining : Math.max(amount, remaining)),
          0
        )

        remaining -= credits

        return price + credits * creditTiers[tier]
      }, 0)
    },
  },
})
