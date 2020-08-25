<template>
  <div>
    <Crumbs v-if="!noCrumbs" :crumbs="crumbNav" />

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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import PageHead from '~/components/PageHead.vue'
import Subscribe from '~/components/Subscribe.vue'
import SideNav from '~/components/SideNav.vue'
import Crumbs from '~/components/Crumbs.vue'
import SignIn from '~/components/SignIn.vue'
import Credits from '~/components/Credits.vue'
import userNav from '~/assets/json/nav/user.json'

export default {
  components: {
    PageHead,
    Subscribe,
    SideNav,
    Crumbs,
    SignIn,
    Credits,
  },
  props: {
    crumbs: {
      type: [Array, String],
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
    noCrumbs: {
      type: Boolean,
      default: false,
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
    noSubscribe: {
      type: Boolean,
      default: false,
    },
    narrow: {
      type: Boolean,
      default: false,
    },
    noHero: {
      type: Boolean,
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
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
    }),
    sideNav() {
      return this.secure
        ? this.isSignedIn
          ? userNav
          : userNav.filter((item) => !item.auth)
        : this.side
    },
    crumbNav() {
      return [...this.crumbs, { title: this.title, to: '' }]
    },
  },
  mounted() {
    this.set({
      hero: !this.noHero || this.secure,
      secure: this.secure,
    })
  },
  methods: {
    ...mapActions({
      set: 'page/set',
    }),
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
