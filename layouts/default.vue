<template>
  <v-app light>
    <v-main>
      <Header
        :main-nav="headerNav"
        :user-nav="userNav"
        @openDrawer="$refs.drawer.open()"
      />

      <nuxt />

      <Footer :main-nav="mainNav" />
    </v-main>

    <Drawer ref="drawer" :main-nav="headerNav" :user-nav="userNav" />
  </v-app>
</template>

<script>
/* globals $crisp */

import { mapState, mapActions } from 'vuex'

import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import Drawer from '~/components/Drawer.vue'
import mainNav from '~/assets/json/nav/main.json'
import userNav from '~/assets/json/nav/user.json'

export default {
  components: {
    Header,
    Footer,
    Drawer,
  },
  data() {
    return {
      mainNav,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
      isMember: ({ user }) =>
        !user.admin && user.impersonator && !user.impersonator.admin,
    }),
    userNav() {
      return this.isSignedIn
        ? userNav.filter((item) => (this.isMember ? item.member : true))
        : userNav.filter((item) => !item.auth)
    },
    headerNav() {
      return this.mainNav.filter(({ header }) => header !== false)
    },
  },
  watch: {
    async isSignedIn(isSignedIn) {
      if (isSignedIn) {
        const impersonating = this.$cookies.get('impersonate')

        if (impersonating) {
          this.signInAs(impersonating)
        } else {
          await Promise.all([this.getOrganisations(), this.getCredits()])
        }
      }
    },
    $route() {
      this.checkChat()
    },
  },
  mounted() {
    this.initChat()

    this.updateUserAttrs()
  },
  methods: {
    ...mapActions({
      updateUserAttrs: 'user/updateAttrs',
      getOrganisations: 'organisations/get',
      getCredits: 'credits/get',
    }),
    initChat() {
      if (typeof $crisp !== 'undefined') {
        return
      }

      const offset = new Date().getTimezoneOffset()

      if (offset >= 330 && offset <= 360) {
        return
      }

      window.$crisp = []
      window.CRISP_WEBSITE_ID = 'f2002ef6-c76c-4d05-9eb3-f67d7cb1cb68'

      const script = document.createElement('script')

      script.src = 'https://client.crisp.chat/l.js'
      script.async = 1

      document.getElementsByTagName('head')[0].appendChild(script)

      $crisp.push(['safe', true])

      this.checkChat()
    },
    async checkChat() {
      if (typeof $crisp === 'undefined') {
        return
      }

      if (!$crisp.is) {
        await new Promise((resolve) =>
          $crisp.push(['on', 'session:loaded', () => resolve()])
        )
      }

      if (this.isSignedIn) {
        $crisp.push(['set', 'user:email', [this.user.email]])
        $crisp.push(['set', 'user:nickname', [this.user.name]])
        $crisp.push(['set', 'user:company', [this.user.billingName]])
      }

      if (
        [
          '/lists/',
          '/bulk/',
          '/api/',
          '/contact/',
          '/faq/',
          '/pricing/',
          '/orders/',
        ].some((path) => this.$route.path.startsWith(path))
      ) {
        if ($crisp.is('chat:hidden')) {
          $crisp.push(['do', 'chat:show'])
        }
      } else if ($crisp.is('chat:visible') && !$crisp.is('chat:opened')) {
        $crisp.do('chat:hide')
      }
    },
  },
}
</script>
