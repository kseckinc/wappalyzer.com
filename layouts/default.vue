<template>
  <v-app light>
    <v-main>
      <Header
        :main-nav="mainNav"
        :user-nav="userNav"
        :is-signed-in="isSignedIn"
        :user="user"
        :dense="!isHero || isSecure"
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
  props: {
    dense: {
      type: Boolean,
      default: false,
    },
    auth: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drawer: false,
      mainNav,
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      user: ({ user }) => user.attrs,
      isSecure: ({ page }) => page.isSecure,
      isHero: ({ page }) => page.isHero,
    }),
    userNav() {
      return this.isSignedIn ? userNav : userNav.filter((item) => !item.auth)
    },
  },
  mounted() {
    this.updateUserAttrs()
  },
  methods: {
    ...mapActions({
      updateUserAttrs: 'user/updateAttrs',
    }),
  },
}
</script>
