<template>
  <v-navigation-drawer v-model="isOpen" right temporary app>
    <template v-if="user.email">
      <v-list nav dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="mb-2"> Signed in as </v-list-item-title>

            <small>{{ user.billingName || user.name || user.email }}</small>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
    </template>

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

    <v-list nav dense>
      <v-list-item v-if="isMember || isAdmin" @click="signOutAs">
        <v-list-item-content>
          <v-list-item-title>
            {{
              impersonator.billingName ||
              impersonator.name ||
              impersonator.email
            }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon dense>{{ mdi.mdiAccountSwitch }}</v-icon>
        </v-list-item-icon>
      </v-list-item>

      <v-list-item v-if="user.admin" to="/admin/">
        <v-list-item-title> Administration </v-list-item-title>
        <v-list-item-icon>
          <v-icon color="success" dense>{{ mdi.mdiLockOpen }}</v-icon>
        </v-list-item-icon>
      </v-list-item>

      <template v-if="isSignedIn">
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
            <v-icon dense>{{ mdi[item.icon] }}</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </template>
    </v-list>
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
} from '@mdi/js'

export default {
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
      },
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
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
  methods: {
    open() {
      this.isOpen = true
    },
  },
}
</script>
