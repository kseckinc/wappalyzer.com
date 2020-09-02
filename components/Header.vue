<template>
  <div>
    <v-sheet class="header" color="primary darken-1" tile>
      <v-container tag="header">
        <v-row class="align-center">
          <v-col md="auto">
            <Logo dark />
          </v-col>

          <v-col class="text-right d-none d-md-block">
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
                <template v-slot:activator="{ on }">
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
                    v-for="({ title: _title, subtitle, to: _to },
                    index2) in items"
                    :key="_title"
                  >
                    <v-divider v-if="index2"></v-divider>
                    <v-list-item
                      :href="_to.match(/^http/) ? _to : null"
                      :target="_to.match(/^http/) ? '_blank' : '_self'"
                      :to="_to.match(/^http/) ? null : _to"
                      color="primary"
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
            <v-menu offset-y left eager attach>
              <template v-slot:activator="{ on }">
                <v-btn
                  :icon="!isSignedIn"
                  class="font-weight-regular text-left"
                  color="white"
                  dark
                  text
                  v-on="on"
                >
                  <v-icon :left="isSignedIn" size="20">{{
                    mdi.mdiAccount
                  }}</v-icon>
                  {{ user.email }}
                </v-btn>
              </template>

              <v-sheet tile>
                <v-list nav dense>
                  <v-list-item v-if="user.admin" to="/admin">
                    <v-list-item-icon>
                      <v-icon color="success" dense>{{
                        mdi.mdiLockOpen
                      }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        Administration
                      </v-list-item-title>
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
          </v-col>

          <v-col class="text-right d-md-none">
            <v-btn icon color="white" @click.stop="$emit('openDrawer')">
              <v-icon>{{ mdi.mdiMenu }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<script>
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
  mdiLogoutVariant,
} from '@mdi/js'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo,
  },
  props: {
    hero: {
      type: [Object, Boolean],
      default: true,
    },
    isSignedIn: {
      type: Boolean,
      default: false,
    },
    mainNav: {
      type: Array,
      default: () => [],
    },
    userNav: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
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
        mdiLogoutVariant,
      },
    }
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
