<template>
  <div>
    <v-card flat tile width="100%" class="text-center">
      <v-divider />

      <v-container class="px-0">
        <v-row class="text-left justify-space-between">
          <template v-for="{ to, title, items: _items } in mainNav">
            <v-col :key="title" cols="12" sm="6" md="auto" lg="3">
              <v-list subheader>
                <v-subheader class="subtitle-2">
                  {{ title }}
                </v-subheader>

                <template v-if="_items">
                  <v-list-item
                    v-for="{ title: _title, to: _to } in _items"
                    :key="_to"
                    :href="_to.match(/^http/) ? _to : null"
                    :target="_to.match(/^http/) ? '_blank' : '_self'"
                    :to="_to.match(/^http/) ? null : _to"
                    :rel="_to.match(/^http/) ? `noopener noreferrer` : ''"
                    nuxt
                  >
                    <v-list-item-title class="body-2">
                      {{ _title }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <v-list-item v-else :to="to" color="primary" nuxt>
                  <v-list-item-title class="body-2">
                    {{ title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-card>

    <v-card flat tile class="footer" color="secondary">
      <v-container tag="footer">
        <v-row justify="space-between">
          <v-col cols="12" sm="auto" class="text-center">
            <Logo class="mx-auto d-inline-block d-sm-block" />
          </v-col>

          <v-spacer />

          <v-col cols="12" sm="auto" class="text-center">
            <v-btn
              v-for="{ icon, href } in icons"
              :key="icon"
              :href="href"
              target="blank"
              rel="noopener noreferrer"
              icon
            >
              <v-icon size="20px">{{ mdi[icon] }}</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="12" sm="auto" class="text-center">
            <v-btn
              v-for="{ title, to } in items"
              :key="title"
              :to="to"
              text
              exact
            >
              {{ title }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mdiGithub, mdiSlack, mdiTwitter, mdiLinkedin } from '@mdi/js'
import Logo from '~/components/Logo.vue'
import { icons, items } from '~/assets/json/nav/footer.json'

export default {
  components: {
    Logo,
  },
  props: {
    mainNav: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      icons,
      items,
      mdi: {
        mdiSlack,
        mdiTwitter,
        mdiLinkedin,
        mdiGithub,
      },
    }
  },
}
</script>

<style>
.footer .logo {
  width: 150px;
}
</style>
