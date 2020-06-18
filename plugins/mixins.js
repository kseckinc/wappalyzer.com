import Vue from 'vue'

Vue.mixin({
  methods: {
    formatCurrency: (amount, currency = 'AUD', decimal = false) =>
      `${amount.toLocaleString('en-AU', {
        style: 'currency',
        currency,
        minimumFractionDigits: decimal ? 2 : 0
      })} ${currency}`,
    formatDate: (date) =>
      date.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
    formatNumber: (number, readable) => {
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
    }
  }
})
