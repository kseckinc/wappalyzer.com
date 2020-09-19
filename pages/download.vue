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

      <v-divider class="my-8" />

      <v-card flat>
        <v-card-text class="pa-0">
          <h3 class="mb-2 subtitle-2">Contribute!</h3>

          <p class="mb-8">
            The browser extension is open source, which means that anyone can
            add new technologies or respond to issues.
          </p>

          <v-btn
            href="https://github.com/aliasio/wappalyzer"
            target="_blank"
            rel="noopener noreferrer"
            color="accent"
            class="mb-4"
            outlined
            small
          >
            <v-icon left>{{ mdi.mdiGithub }}</v-icon>
            Contribute on GitHub
          </v-btn>
        </v-card-text>
      </v-card>
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
