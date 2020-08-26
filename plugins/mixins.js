/* globals drift */

import Vue from 'vue'

import { creditTiers } from '~/assets/json/pricing.json'

Vue.mixin({
  mounted() {
    let ready = false
    let shown = false

    const routes = {
      '/about': null,
      '/account': null,
      '/apikey': null,
      '/api': `Hi there! Please let me know if you have any questions about our APIs.`,
      '/bulk': `Hi there! Please let me know if you have any questions about bulk lookups.`,
      '/contact': `Hi there! Please let me know if you have any questions and I'll be happy to help.`,
      '/lists': `Hi there! Please let me know if you have any questions about our lead lists.`,
      '/pricing': `Hi there! Please let me know if you have any questions about our plans and pricing.`,
      '/docs': null,
      '/faq': null,
      '/invoices': null,
      '/orders': null,
      '/paymentmethods': null,
      '/subscriptions': null,
    }

    if (!window.drift) {
      const t = (window.driftt = window.drift = window.driftt || [])

      t.invoked = true

      t.methods = [
        'identify',
        'config',
        'track',
        'reset',
        'debug',
        'show',
        'ping',
        'page',
        'hide',
        'off',
        'on',
      ]

      t.factory = function (e) {
        return function () {
          const n = Array.prototype.slice.call(arguments)
          n.unshift(e)
          t.push(n)
          return t
        }
      }

      t.methods.forEach(function (e) {
        t[e] = t.factory(e)
      })

      t.load = function (t) {
        const e = 3e5
        const n = Math.ceil(new Date() / e) * e
        const o = document.createElement('script')

        o.type = 'text/javascript'
        o.async = !0
        o.crossorigin = 'anonymous'
        o.src = 'https://js.driftt.com/include/' + n + '/' + t + '.js'

        const i = document.getElementsByTagName('script')[0]

        i.parentNode.insertBefore(o, i)
      }

      drift.SNIPPET_VERSION = '0.3.1'
      drift.load('w7g5ksst75mb')
    }

    drift.on('ready', (api, { isOnline }) => {
      if (ready) {
        return
      }

      ready = true

      const user = this.$store.state.user.attrs

      if (user.sub) {
        drift.identify(user.sub, {
          email: user.email || '',
          nickname: user.name || user.email || '',
          userId: user.sub,
        })
      }

      const path = Object.keys(routes).find((path) =>
        this.$route.path.startsWith(path)
      )

      if (path) {
        if (routes[path] && (!shown || routes[path] === '/contact')) {
          api.showWelcomeMessage(
            `${routes[path]}${
              !isOnline
                ? ` I'm away right now but leave message I'll get back to you soon.`
                : ''
            }`
          )

          shown = true
        } else {
          api.hideWelcomeMessage()
          api.widget.show()
        }
      } else {
        api.hideWelcomeMessage()

        setTimeout(() => api.widget.hide(), 100)
      }

      setTimeout(() => {
        const path = Object.keys(routes).find((path) =>
          this.$route.path.startsWith(path)
        )

        if (!path) {
          api.hideWelcomeMessage()

          setTimeout(() => api.widget.hide(), 100)
        }
      }, 1000)
    })
  },
  methods: {
    formatCurrency: (amount, currency = 'AUD', decimal = false) =>
      `${amount.toLocaleString(
        currency.toUpperCase() === 'AUD' ? 'en-AU' : 'en-US',
        {
          style: 'currency',
          currency,
          minimumFractionDigits: decimal ? 2 : 0,
          maximumFractionDigits: decimal ? 3 : 0,
        }
      )} ${currency.toUpperCase()}`,
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
