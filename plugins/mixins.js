import Vue from 'vue'

Vue.mixin({
  data() {
    return {
      creditPrices: {
        1: 10,
        1000: 8,
        10000: 2,
        100000: 0.5
      }
    }
  },
  methods: {
    formatCurrency: (amount, currency = 'AUD', decimal = false) =>
      `${amount.toLocaleString('en-AU', {
        style: 'currency',
        currency,
        minimumFractionDigits: decimal ? 2 : 0,
        maximumFractionDigits: 3
      })} ${currency.toUpperCase()}`,
    formatDate: (date) =>
      date.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
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

      return parseFloat(number).toLocaleString()
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
            return `${error.response.data.message ||
              error.response.data}${code}`
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

      const tier = Object.keys(this.creditPrices)
        .map((tier) => ({
          tier,
          value: parseInt(tier, 10) * this.creditPrices[tier]
        }))
        .filter(({ value }) => value <= cents)
        .reduce((max, { tier }) => Math.max(max, parseInt(tier, 10)), 0)

      return Math.round(cents / this.creditPrices[tier])
    },
    creditsToCents(credits) {
      if (!credits) {
        return 0
      }

      const tiers = Object.keys(this.creditPrices)

      let remaining = credits

      return Math.floor(
        tiers.reduce((price, tier, index) => {
          const rows = Math.max(
            index === tiers.length - 1
              ? remaining
              : Math.min(tier, index ? remaining : Math.max(tier, remaining)),
            0
          )

          remaining -= rows

          return price + rows * this.creditPrices[tier]
        }, 0)
      )
    }
  }
})
