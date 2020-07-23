<template>
  <div>
    <v-sheet class="header" color="primary darken-1" tile>
      <v-container tag="header">
        <v-row class="align-center">
          <v-col md="auto">
            <Logo dark />
          </v-col>

          <v-col class="text-right d-none d-md-block">
            <template v-for="{ title, to, icon, items } in mainNav">
              <v-btn v-if="to" :to="to" :key="title" class="white--text" text>
                {{ title }}
              </v-btn>
              <v-menu v-else offset-y left>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" :icon="!!icon" class="white--text" text>
                    <v-icon v-if="icon" dense>{{ icon }}</v-icon>
                    <template v-else>
                      {{ title }}
                      <v-icon dense right>mdi-chevron-down</v-icon>
                    </template>
                  </v-btn>
                </template>

                <v-list v-if="items" class="header__menu">
                  <div
                    v-for="({ title: _title, subtitle, to: _to },
                    index) in items"
                    :key="_title"
                  >
                    <v-divider v-if="index"></v-divider>
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
                        ><v-icon dense
                          >mdi-open-in-new</v-icon
                        ></v-list-item-icon
                      >
                    </v-list-item>
                  </div>
                </v-list>
              </v-menu>
            </template>
            <v-menu offset-y left>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  :icon="!isSignedIn"
                  class="font-weight-regular"
                  color="white"
                  dark
                  text
                >
                  <v-icon :left="isSignedIn" size="20">mdi-account</v-icon>
                  {{ user.email }}
                </v-btn>
              </template>

              <v-sheet tile>
                <v-list nav dense>
                  <v-list-item v-if="user.admin" to="/admin">
                    <v-list-item-icon>
                      <v-icon color="success" dense>mdi-lock-open</v-icon>
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
                      <v-icon dense>{{ icon }}</v-icon>
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
            <v-btn @click.stop="$emit('openDrawer')" icon color="white">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <Hero v-if="!dense" :title="meta.title" :subtitle="meta.text" />
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import Hero from '~/components/Hero.vue'
import { hero as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Logo,
    Hero
  },
  props: {
    dense: {
      type: Boolean,
      default: false
    },
    isSignedIn: {
      type: Boolean,
      default: false
    },
    mainNav: {
      type: Array,
      default: () => []
    },
    userNav: {
      type: Array,
      default: () => []
    },
    user: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      meta
    }
  }
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
