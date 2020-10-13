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
    </Page>
  </div>
</template>

<script>
import {
  mdiGithub,
  mdiMicrosoftEdge,
  mdiFirefox,
  mdiGoogleChrome,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import { download as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: meta.title,
      mdi: {
        mdiGithub,
        mdiMicrosoftEdge,
        mdiFirefox,
        mdiGoogleChrome,
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
