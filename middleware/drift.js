/* globals drift */

const shown = []

const routes = {
  '/about': null,
  '/account': null,
  '/apikey': null,
  '/api': `Hi there! Please let me know if you have any questions about our APIs.`,
  '/bulk': `Hi there! Please let me know if you have any questions about bulk lookups.`,
  '/contact': `Hi there! Please let me know if you have any questions and I'll be happy to help.`,
  '/datasets': `Hi there! Please let me know if you have any questions about our datasets.`,
  '/pricing': `Hi there! Please let me know if you have any questions about our plans and pricing.`,
  '/docs': null,
  '/faq': null,
  '/invoices': null,
  '/orders': null,
  '/paymentmethods': null,
  '/subscriptions': null
}

export default ({ route, store }) => {
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
      'on'
    ]

    t.factory = function(e) {
      return function() {
        const n = Array.prototype.slice.call(arguments)
        n.unshift(e)
        t.push(n)
        return t
      }
    }

    t.methods.forEach(function(e) {
      t[e] = t.factory(e)
    })

    t.load = function(t) {
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
    const user = store.state.user.attrs

    if (user.sub) {
      drift.identify(user.sub, {
        email: user.email || '',
        nickname: user.name || user.email || '',
        userId: user.sub
      })
    }

    const path = Object.keys(routes).find((path) => route.path.startsWith(path))

    if (path) {
      if (routes[path] && !shown.includes(path)) {
        api.showWelcomeMessage(
          `${routes[path]}${
            !isOnline
              ? ` I'm away right now but leave message I'll get back to you soon.`
              : ''
          }`
        )

        shown.push(path)
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
        route.path.startsWith(path)
      )

      if (!path) {
        api.hideWelcomeMessage()

        setTimeout(() => api.widget.hide(), 100)
      }
    }, 1000)
  })
}
