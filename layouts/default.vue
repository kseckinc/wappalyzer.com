<template>
  <v-app light>
    <v-main>
      <Header
        :main-nav="mainNav"
        :user-nav="userNav"
        :is-signed-in="isSignedIn"
        :user="user"
        @openDrawer="$refs.drawer.open()"
      />

      <nuxt />

      <Footer :main-nav="mainNav" />
    </v-main>

    <Drawer ref="drawer" :main-nav="mainNav" :user-nav="userNav" :user="user" />

    <script
      async
      src="https://r.wdfl.co/rw.js"
      data-rewardful="7fd1cb"
    ></script>
  </v-app>
</template>

<script>
/* globals drift */

import { mapState, mapActions } from 'vuex'

import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import Drawer from '~/components/Drawer.vue'
import mainNav from '~/assets/json/nav/main.json'
import userNav from '~/assets/json/nav/user.json'

const driftRoutes = {
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

export default {
  components: {
    Header,
    Footer,
    Drawer,
  },
  data() {
    return {
      mainNav,
      driftShown: false,
      driftApi: null,
      driftIsOnline: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
    }),
    sideNav() {
      return this.secure
        ? this.isSignedIn
          ? userNav
          : userNav.filter((item) => !item.auth)
        : this.side
    },
    userNav() {
      return this.isSignedIn ? userNav : userNav.filter((item) => !item.auth)
    },
  },
  watch: {
    $route() {
      this.checkDrift()
    },
  },
  mounted() {
    this.updateUserAttrs()

    this.checkDrift()
  },
  methods: {
    ...mapActions({
      updateUserAttrs: 'user/updateAttrs',
    }),
    initDrift() {
      if (!window.drift) {
        return new Promise((resolve) => {
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

          drift.on('ready', (api, { isOnline }) => {
            this.driftApi = api
            this.driftOnline = isOnline

            resolve()
          })
        })
      }
    },
    async checkDrift() {
      const path = Object.keys(driftRoutes).find((path) =>
        this.$route.path.startsWith(path)
      )

      if (!path) {
        if (this.driftApi) {
          this.driftApi.hideWelcomeMessage()

          setTimeout(() => this.driftApi.widget.hide(), 100)
        }

        return
      }

      if (!this.driftApi) {
        await this.initDrift()

        if (!this.driftApi) {
          return
        }
      }

      if (this.user.sub) {
        drift.identify(this.user.sub, {
          email: this.user.email || '',
          nickname: this.user.name || this.user.email || '',
          userId: this.user.sub,
        })
      }

      if (driftRoutes[path] && (!this.driftShown || path === '/contact')) {
        this.driftApi.showWelcomeMessage(
          `${driftRoutes[path]}${
            !this.driftOnline
              ? ` I'm away right now but leave message I'll get back to you soon.`
              : ''
          }`
        )

        this.driftShown = true
      } else {
        this.driftApi.hideWelcomeMessage()
        this.driftApi.widget.show()
      }
    },
  },
}
</script>
