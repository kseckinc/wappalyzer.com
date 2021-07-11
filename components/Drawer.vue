<template>
  <v-navigation-drawer v-model="isOpen" right temporary app>
    <v-list nav dense>
      <v-list-item v-if="isLoading">
        <v-list-item-content>
          <Spinner />
        </v-list-item-content>
      </v-list-item>
      <template v-else>
        <v-list-item v-if="isSignedIn">
          <v-list-item-content>
            <v-list-item-title class="mb-2"> Signed in as </v-list-item-title>

            <span>
              <small>{{ user.billingName || user.name || user.email }}</small>

              <v-chip v-if="isPro" color="primary" class="ml-1" outlined x-small
                >PRO</v-chip
              >
            </span>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-else @click="signInDialog = true">
          <v-list-item-title>Sign up free</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isMember || isAdmin" @click="signOutAs">
          <v-list-item-content>
            <v-list-item-title>
              <span>
                {{
                  impersonator.billingName ||
                  impersonator.name ||
                  impersonator.email
                }}

                <v-chip
                  v-if="isPro"
                  color="primary"
                  class="ml-1"
                  outlined
                  x-small
                  >PRO</v-chip
                >
              </span>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon dense>
              {{ mdi.mdiAccountSwitch }}
            </v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item v-if="user.admin" to="/admin/">
          <v-list-item-title>Admin</v-list-item-title>
          <v-list-item-icon>
            <v-icon color="success" dense>
              {{ mdi.mdiLockOpen }}
            </v-icon>
          </v-list-item-icon>
        </v-list-item>
      </template>
    </v-list>
    <v-divider />

    <div v-for="(item, i) in mainNav" :key="i">
      <v-list nav dense>
        <v-subheader v-if="item.items">
          {{ item.title }}
        </v-subheader>
        <v-list-item v-else :to="item.to" color="primary" nuxt>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
        <template v-if="item.items">
          <v-list-item
            v-for="(subitem, j) in item.items"
            :key="j"
            :href="subitem.to.match(/^http/) ? subitem.to : null"
            :target="subitem.to.match(/^http/) ? '_blank' : '_self'"
            :to="subitem.to.match(/^http/) ? null : subitem.to"
            color="primary"
            nuxt
          >
            <v-list-item-title>
              {{ subitem.title }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>

      <v-divider />
    </div>

    <v-list v-if="isSignedIn" nav dense>
      <v-list-item
        v-for="(item, i) in userNav"
        :key="i"
        :to="item.to"
        color="primary"
      >
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
        <v-list-item-icon v-if="item.icon">
          <v-icon dense>
            {{ mdi[item.icon] }}
          </v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-sign-up />
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiAccount,
  mdiLockOpen,
  mdiAlphaCCircle,
  mdiCreditCard,
  mdiCalendarSync,
  mdiCart,
  mdiFileDocumentOutline,
  mdiKeyVariant,
  mdiLogoutVariant,
  mdiStar,
  mdiDomain,
  mdiFilterVariant,
  mdiAccountSwitch,
  mdiPowerPlug,
  mdiMagnify,
  mdiEmailCheckOutline,
} from '@mdi/js'

import SignIn from '~/components/SignIn.vue'
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    SignIn,
    Spinner,
  },
  props: {
    mainNav: {
      type: Array,
      default: () => [],
    },
    userNav: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isOpen: false,
      signInDialog: false,
      mdi: {
        mdiAccount,
        mdiLockOpen,
        mdiAlphaCCircle,
        mdiCreditCard,
        mdiCalendarSync,
        mdiCart,
        mdiFileDocumentOutline,
        mdiKeyVariant,
        mdiLogoutVariant,
        mdiStar,
        mdiDomain,
        mdiFilterVariant,
        mdiAccountSwitch,
        mdiPowerPlug,
        mdiMagnify,
        mdiEmailCheckOutline,
      },
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isPro: ({ credits }) => credits.pro,
      isLoading: ({ user }) => user.loading,
      isSignedIn: ({ user }) => user.isSignedIn,
      isAdmin: ({ user }) =>
        user.isSignedIn &&
        (user.admin || (user.impersonator && user.impersonator.admin)),
      isMember: ({ user }) =>
        user.isSignedIn &&
        !user.admin &&
        user.impersonator &&
        !user.impersonator.admin,
      impersonator: ({ user }) => user.impersonator,
    }),
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn) {
        this.signInDialog = false
      }
    },
  },
  methods: {
    open() {
      this.isOpen = true
    },
  },
}
</script>
