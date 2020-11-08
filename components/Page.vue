<template>
  <div>
    <v-main>
      <Hero
        v-if="hero"
        :title="hero.title || meta.title"
        :subtitle="hero.subtitle || meta.text"
      />

      <v-sheet v-if="cta" color="primary" tile>
        <v-container class="white--text text-center body-2 py-6">
          <p>
            Sell and market more effectively with technographic insights.<br />
            Create lists of websites and contacts using certain technologies.
          </p>

          <v-btn to="/" color="white" small outlined>
            Explore our products
          </v-btn>
        </v-container>
      </v-sheet>

      <Crumbs v-if="crumbs" :crumbs="crumbNav" />

      <slot name="header" />

      <v-container class="py-10 py-sm-12">
        <SignIn v-if="secure && !isSignedIn" class="px-2" mode-continue />
        <v-row v-else-if="sideNav.length">
          <v-col cols="12" sm="4" lg="3" order="2" order-sm="0">
            <Credits v-if="secure && isSignedIn" variant />

            <SideNav :items="sideNav" />
          </v-col>
          <v-col cols="12" sm="8" lg="9">
            <PageHead
              v-if="!noHead"
              :loading="loading"
              :title="head.title"
              :subtitle="head.subtitle"
              :text="head.text"
              :image="head.image"
            >
              <slot />
            </PageHead>
            <slot v-else />
            <slot name="content" />
          </v-col>
        </v-row>
        <v-row v-else-if="narrow" justify="center" no-gutters>
          <v-col sm="10" md="10" lg="8">
            <PageHead
              v-if="!noHead"
              :loading="loading"
              :title="head.title"
              :subtitle="head.subtitle"
              :text="head.text"
              :image="head.image"
            >
              <slot />
            </PageHead>
            <slot v-else />
            <slot name="content" />
          </v-col>
        </v-row>
        <template v-else>
          <PageHead
            v-if="!noHead"
            :loading="loading"
            :title="head.title"
            :subtitle="head.subtitle"
            :text="head.text"
            :image="head.image"
          >
            <slot />
          </PageHead>
          <slot v-else />
          <slot name="content" />
        </template>
      </v-container>

      <slot name="footer" />

      <Subscribe v-if="!noSubscribe && (!secure || isSignedIn)" />
    </v-main>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import PageHead from '~/components/PageHead.vue'
import Subscribe from '~/components/Subscribe.vue'
import SideNav from '~/components/SideNav.vue'
import Crumbs from '~/components/Crumbs.vue'
import SignIn from '~/components/SignIn.vue'
import Credits from '~/components/Credits.vue'
import Hero from '~/components/Hero.vue'
import userNav from '~/assets/json/nav/user.json'
import { hero as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Hero,
    PageHead,
    Subscribe,
    SideNav,
    Crumbs,
    SignIn,
    Credits,
  },
  props: {
    crumbs: {
      type: [Array, String, Boolean],
      default: () => [],
    },
    side: {
      type: Array,
      default: () => [],
    },
    seoTitle: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    head: {
      type: Object,
      default() {
        return {
          loading: this.loading,
          title: this.title,
          subtitle: '',
          text: '',
          image: '',
          meta: '',
        }
      },
    },
    noHead: {
      type: Boolean,
      default: false,
    },
    noSideBar: {
      type: Boolean,
      default: false,
    },
    noSubscribe: {
      type: Boolean,
      default: false,
    },
    narrow: {
      type: Boolean,
      default: false,
    },
    hero: {
      type: [Object, Boolean],
      default: false,
    },
    secure: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drawer: false,
      cta: this.$route.path === '/upgraded/',
      meta,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
      isMember: ({ user }) =>
        !user.admin && user.impersonator && !user.impersonator.admin,
    }),
    sideNav() {
      return this.secure && !this.noSideBar
        ? this.isSignedIn
          ? userNav.filter((item) => (this.isMember ? item.member : true))
          : userNav.filter((item) =>
              !item.auth && this.isMember ? item.member : true
            )
        : this.side
    },
    crumbNav() {
      return [...this.crumbs, { title: this.title, to: '' }]
    },
  },
  head() {
    return {
      title: this.seoTitle || this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.head.meta || this.head.text || '',
        },
      ],
    }
  },
}
</script>
