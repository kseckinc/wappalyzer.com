<template>
  <v-row align="stretch">
    <v-col
      v-for="(integration, name) in integrations"
      :key="name"
      cols="6"
      md="3"
    >
      <v-card
        class="d-flex flex-column justify-space-between"
        style="height: 100%;"
        :outlined="!feature"
        flat
      >
        <v-card-text
          :class="feature ? 'px-0' : 'pb-0'"
          style="cursor: pointer;"
          @click="goto(integration.href)"
        >
          <div class="mb-4">
            <component :is="images[integration.image]" width="40" height="40" />
          </div>

          <div class="mb-2 d-flex align-center">
            <h2 class="mr-2">
              {{ integration.name }}
            </h2>
            <v-chip v-if="integration.pro" color="primary" x-small outlined
              >PRO</v-chip
            >
          </div>

          {{ integration.description }}
        </v-card-text>
        <v-card-actions v-if="!feature">
          <v-spacer />

          <v-tooltip v-if="integration.settings" top>
            <template v-slot:activator="{ on }">
              <v-btn :to="integration.settings" icon v-on="on">
                <v-icon>{{ mdiCog }}</v-icon>
              </v-btn>
            </template>

            Manage
          </v-tooltip>

          <v-tooltip v-if="integration.docs" top>
            <template v-slot:activator="{ on }">
              <v-btn :to="integration.docs" icon v-on="on">
                <v-icon>{{ mdiInformationOutline }}</v-icon>
              </v-btn>
            </template>

            Documentation
          </v-tooltip>

          <v-tooltip v-if="integration.href" top>
            <template v-slot:activator="{ on }">
              <v-btn :href="integration.href" target="_blank" icon v-on="on">
                <v-icon>{{ mdiOpenInNew }}</v-icon>
              </v-btn>
            </template>

            View app
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mdiInformationOutline, mdiCog, mdiOpenInNew } from '@mdi/js'

import ImageHubspot from '~/assets/images/integrations/hubspot.svg?inline'
import ImageZapier from '~/assets/images/integrations/zapier.svg?inline'
import ImageGmail from '~/assets/images/integrations/gmail.svg?inline'
import ImageChrome from '~/assets/images/integrations/chrome.svg?inline'
import ImageFirefox from '~/assets/images/integrations/firefox.svg?inline'
import ImageEdge from '~/assets/images/integrations/edge.svg?inline'
import ImageSafari from '~/assets/images/integrations/safari.svg?inline'

import integrations from '~/assets/json/integrations.json'

export default {
  props: {
    feature: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      integrations,
      mdiInformationOutline,
      mdiCog,
      mdiOpenInNew,
      images: {
        'hubspot.svg': ImageHubspot,
        'zapier.svg': ImageZapier,
        'gmail.svg': ImageGmail,
        'chrome.svg': ImageChrome,
        'firefox.svg': ImageFirefox,
        'edge.svg': ImageEdge,
        'safari.svg': ImageSafari,
      },
    }
  },
  methods: {
    goto(url) {
      window.open(url)
    },
  },
}
</script>
