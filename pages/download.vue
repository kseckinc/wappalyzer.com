<template>
  <div>
    <Page
      :title="title"
      :head="{ ...meta, image: 'extension-2.svg' }"
      no-heading
    >
      <div class="mt-8 mb-4">
        <v-btn
          v-for="{ text, href, icon } in platforms"
          :key="text"
          :href="href"
          color="primary"
          class="mr-2 mb-4"
          target="_blank"
          rel="noopener noreferrer"
          outlined
        >
          <v-icon left>{{ mdi[icon] }}</v-icon>
          {{ text }}
        </v-btn>
      </div>

      <v-btn color="accent" class="mb-2" outlined @click="faqDialog = true">
        <v-icon left>{{ mdi.mdiForum }}</v-icon>
        Frequently asked questions
      </v-btn>

      <v-dialog v-model="faqDialog" max-width="600px">
        <v-card>
          <v-card-title>
            Frequently asked questions
          </v-card-title>
          <v-card-text class="pb-0">
            <Faqs topic="extension" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="faqDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </Page>
  </div>
</template>

<script>
import {
  mdiGithub,
  mdiMicrosoftEdge,
  mdiFirefox,
  mdiGoogleChrome,
  mdiForum,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Faqs from '~/components/Faqs.vue'
import { download as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Page,
    Faqs,
  },
  data() {
    return {
      title: meta.title,
      faqDialog: false,
      mdi: {
        mdiGithub,
        mdiMicrosoftEdge,
        mdiFirefox,
        mdiGoogleChrome,
        mdiForum,
      },
      meta,
      platforms: [
        {
          text: 'Google Chrome',
          href:
            'https://chrome.google.com/webstore/detail/wappalyzer/gppongmhjkpfnbhagpmjfkannfbllamg',
          icon: 'mdiGoogleChrome',
        },
        {
          text: 'Mozilla Firefox',
          href: 'https://addons.mozilla.org/en-US/firefox/addon/wappalyzer/',
          icon: 'mdiFirefox',
        },
        {
          text: 'Microsoft Edge',
          href:
            'https://microsoftedge.microsoft.com/addons/detail/mnbndgmknlpdjdnjfmfcdjoegcckoikn',
          icon: 'mdiMicrosoftEdge',
        },
      ],
    }
  },
}
</script>
