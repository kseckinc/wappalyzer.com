<template>
  <v-row align="stretch">
    <template v-for="(app, name) in apps">
      <v-col
        v-if="!integrations || app.settings"
        :key="name"
        cols="12"
        :sm="6"
        :md="integrations ? 6 : 4"
        :lg="integrations ? 4 : 3"
      >
        <v-card
          class="d-flex flex-column justify-space-between"
          style="height: 100%"
          :outlined="!feature"
          flat
        >
          <v-card-text
            :class="feature ? 'px-0' : 'pb-0'"
            style="cursor: pointer"
            @click="goto(integrations ? app.settings : app.href)"
          >
            <v-row>
              <v-col cols="3" sm="12" class="d-flex align-center">
                <img
                  :src="images[app.image]"
                  width="40"
                  height="40"
                  class="d-block"
                />
              </v-col>
              <v-col>
                <div class="mb-2 d-flex align-center">
                  <h2 class="mr-2">
                    {{ app.name }}
                  </h2>
                </div>

                {{ app.description }}
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions v-if="!feature">
            <v-spacer />

            <v-tooltip v-if="app.settings" top>
              <template #activator="{ on }">
                <v-btn :to="app.settings" icon v-on="on">
                  <v-icon>{{ mdiCog }}</v-icon>
                </v-btn>
              </template>

              Manage
            </v-tooltip>

            <v-tooltip v-if="app.docs" top>
              <template #activator="{ on }">
                <v-btn :to="app.docs" icon v-on="on">
                  <v-icon>{{ mdiInformationOutline }}</v-icon>
                </v-btn>
              </template>

              Documentation
            </v-tooltip>

            <v-tooltip v-if="app.href" top>
              <template #activator="{ on }">
                <v-btn :href="app.href" target="_blank" icon v-on="on">
                  <v-icon>{{ mdiOpenInNew }}</v-icon>
                </v-btn>
              </template>

              View app
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import { mdiInformationOutline, mdiCog, mdiOpenInNew } from '@mdi/js'

import ImageHubspot from '~/assets/images/apps/hubspot.svg?data'
import ImagePipedrive from '~/assets/images/apps/pipedrive.svg?data'
import ImageZapier from '~/assets/images/apps/zapier.svg?data'
import ImageGmail from '~/assets/images/apps/gmail.svg?data'
import ImageChrome from '~/assets/images/apps/chrome.svg?data'
import ImageFirefox from '~/assets/images/apps/firefox.svg?data'
import ImageEdge from '~/assets/images/apps/edge.svg?data'
import ImageSafari from '~/assets/images/apps/safari.svg?data'
import ImageAndroid from '~/assets/images/apps/android.svg?data'
import ImageIntegromat from '~/assets/images/apps/integromat.svg?data'

import apps from '~/assets/json/apps.json'

export default {
  props: {
    feature: {
      type: Boolean,
      default: false,
    },
    integrations: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      apps,
      mdiInformationOutline,
      mdiCog,
      mdiOpenInNew,
      images: {
        'hubspot.svg': ImageHubspot,
        'pipedrive.svg': ImagePipedrive,
        'zapier.svg': ImageZapier,
        'gmail.svg': ImageGmail,
        'chrome.svg': ImageChrome,
        'firefox.svg': ImageFirefox,
        'edge.svg': ImageEdge,
        'safari.svg': ImageSafari,
        'android.svg': ImageAndroid,
        'integromat.svg': ImageIntegromat,
      },
    }
  },
  methods: {
    goto(url) {
      if (url.startsWith('/')) {
        this.$router.push(url)
      } else {
        window.open(url)
      }
    },
  },
}
</script>
