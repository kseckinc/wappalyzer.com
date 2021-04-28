<template>
  <div>
    <v-sheet
      v-if="isAdmin && user.disabled"
      color="error white--text"
      class="pb-1 text-center"
      tile
      ><small>User disabled</small></v-sheet
    >
    <v-sheet class="header" color="primary" tile>
      <v-container tag="header">
        <v-row class="align-center">
          <v-col class="flex-grow-0 flex-shrink-1">
            <Logo dark />
          </v-col>

          <v-col class="d-none d-md-block flex-grow-1 flex-shrink-0 text-right">
            <template v-for="({ title, to, icon, items }, index) in mainNav">
              <v-btn v-if="to" :key="title" :to="to" class="white--text" text>
                {{ title }}
              </v-btn>
              <v-menu
                v-else
                :key="index"
                class="text-left"
                offset-y
                left
                eager
                attach
              >
                <template #activator="{ on }">
                  <v-btn :icon="!!icon" class="white--text" text v-on="on">
                    <v-icon v-if="icon" dense>{{ icon }}</v-icon>
                    <template v-else>
                      {{ title }}
                      <v-icon dense right>{{ mdi.mdiChevronDown }}</v-icon>
                    </template>
                  </v-btn>
                </template>

                <v-list v-if="items" class="header__menu">
                  <div
                    v-for="(
                      { title: _title, subtitle, icon: _icon, to: _to }, index2
                    ) in items"
                    :key="_title"
                  >
                    <v-divider v-if="index2"></v-divider>
                    <v-list-item
                      :href="_to.match(/^http/) ? _to : null"
                      :target="_to.match(/^http/) ? '_blank' : '_self'"
                      :to="_to.match(/^http/) ? null : _to"
                      color="primary"
                    >
                      <v-list-item-action v-if="_icon"
                        ><v-icon color="primary" dense>{{
                          mdi[_icon]
                        }}</v-icon></v-list-item-action
                      >
                      <v-list-item-content class="py-4">
                        <v-list-item-title class="subtitle-2">
                          {{ _title }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          v-if="subtitle"
                          class="subtitle-2 font-weight-regular header__subtitle"
                        >
                          {{ subtitle }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-icon v-if="_to.match(/^http/)"
                        ><v-icon dense>{{
                          mdi.mdiOpenInNew
                        }}</v-icon></v-list-item-icon
                      >
                    </v-list-item>
                  </div>
                </v-list>
              </v-menu>
            </template>
            <v-menu
              v-if="isSignedIn"
              class="text-left"
              offset-y
              left
              eager
              attach
            >
              <template #activator="{ on }">
                <v-btn
                  class="font-weight-regular text-left"
                  color="white"
                  dark
                  text
                  v-on="on"
                >
                  <v-icon v-if="!isAdmin && !isMember" left size="20">{{
                    mdi.mdiAccount
                  }}</v-icon>
                  <v-icon v-else-if="isAdmin" left size="20">{{
                    mdi.mdiLockOpen
                  }}</v-icon>
                  <v-icon v-else-if="isMember" left size="20">{{
                    mdi.mdiDomain
                  }}</v-icon>
                  {{ user.billingName || user.name || user.email }}
                </v-btn>
              </template>

              <v-sheet v-if="isMember || isAdmin" tile>
                <v-list nav dense>
                  <v-list-item @click="signOutAs">
                    <v-list-item-icon>
                      <v-icon dense>{{ mdi.mdiAccountSwitch }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{
                          impersonator.billingName ||
                          impersonator.name ||
                          impersonator.email
                        }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider />
              </v-sheet>

              <v-sheet
                v-if="isSignedIn && !isMember && organisations.length"
                tile
              >
                <v-list nav dense>
                  <v-list-item
                    v-for="organisation in organisations"
                    :key="organisation.id"
                    @click="signInAs(organisation.organisationId)"
                  >
                    <v-list-item-icon>
                      <v-icon dense>{{ mdi.mdiAccountSwitch }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ organisation.name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider />
              </v-sheet>

              <v-sheet tile>
                <v-list nav dense>
                  <v-list-item v-if="user.admin" to="/admin">
                    <v-list-item-icon>
                      <v-icon color="success" dense>{{
                        mdi.mdiLockOpen
                      }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Admin</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-for="{ title, to, icon } in userNav"
                    :key="title"
                    :to="to"
                  >
                    <v-list-item-icon>
                      <v-icon dense>{{ mdi[icon] }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-menu>
            <v-btn
              v-else
              color="white "
              class="ml-2"
              outlined
              @click="signInDialog = true"
              >Sign up free</v-btn
            >
          </v-col>

          <v-col class="text-right d-md-none">
            <v-btn icon color="white" @click.stop="$emit('openDrawer')">
              <v-icon>{{ mdi.mdiMenu }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-sign-up />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiChevronDown,
  mdiAccount,
  mdiMenu,
  mdiLockOpen,
  mdiAlphaCCircle,
  mdiCreditCard,
  mdiCalendarSync,
  mdiCart,
  mdiFileDocumentOutline,
  mdiKeyVariant,
  mdiStar,
  mdiLogoutVariant,
  mdiDomain,
  mdiAccountSwitch,
  mdiFilterVariant,
  mdiPowerPlug,
  mdiLayersOutline,
  mdiApps,
  mdiConsole,
  mdiBellOutline,
} from '@mdi/js'
import Logo from '~/components/Logo.vue'
import SignIn from '~/components/SignIn.vue'

export default {
  components: {
    Logo,
    SignIn,
  },
  props: {
    hero: {
      type: [Object, Boolean],
      default: true,
    },
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
      signInDialog: false,
      mdi: {
        mdiChevronDown,
        mdiAccount,
        mdiMenu,
        mdiLockOpen,
        mdiAlphaCCircle,
        mdiCreditCard,
        mdiCalendarSync,
        mdiCart,
        mdiFileDocumentOutline,
        mdiKeyVariant,
        mdiStar,
        mdiLogoutVariant,
        mdiDomain,
        mdiAccountSwitch,
        mdiFilterVariant,
        mdiPowerPlug,
        mdiLayersOutline,
        mdiApps,
        mdiConsole,
        mdiBellOutline,
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
      organisations: ({ organisations }) => organisations.memberOf,
    }),
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn) {
        this.signInDialog = false
      }
    },
  },
}
</script>

<style>
.header .logo {
  height: 50px !important;
  width: 200px;
}

.header__menu {
  max-width: 450px;
}

.header__subtitle {
  white-space: normal !important;
}
</style>
