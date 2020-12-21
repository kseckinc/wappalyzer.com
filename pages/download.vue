<template>
  <div>
    <Page
      :title="title"
      :head="{ ...meta, image: 'extension-2.svg' }"
      no-heading
    >
      <v-btn
        color="accent"
        class="mt-4 mb-10"
        outlined
        @click="faqDialog = true"
      >
        <v-icon left>{{ mdi.mdiForum }}</v-icon>
        FAQs
      </v-btn>

      <v-row class="mb-4">
        <v-col
          v-for="{ text, href, icon } in platforms"
          :key="text"
          class="py-0"
          cols="6"
        >
          <v-btn
            :href="href"
            color="primary"
            class="mr-2 mb-4"
            target="_blank"
            rel="noopener noreferrer"
            outlined
            x-large
            width="100%"
            height="80px"
          >
            <v-icon left size="24">{{ mdi[icon] }}</v-icon>
            {{ text }}
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-8" />

      <h2 class="mb-2">Mobile apps</h2>

      <p>
        Wappalyzer is available on mobile devices as a
        <a
          href="https://web.dev/progressive-web-apps/"
          target="_blank"
          rel="noopener"
          >Progressive Web App</a
        >.
      </p>

      <v-row>
        <v-col>
          <v-card height="100%" class="d-flex flex-column">
            <v-card-title class="subtitle-2">
              <v-icon left>{{ mdi.mdiAndroid }}</v-icon>
              Android app
            </v-card-title>
            <v-card-text>
              <ol>
                <li class="mb-2">
                  On your Android device, open Chrome and go to
                  <a href="https://twa.wappalyzer.com" target="_blank"
                    >twa.wappalyzer.com</a
                  >.
                </li>
                <li class="mb-2">
                  In the menu, click 'Add to Home screen'.
                </li>
                <li class="mb-2">
                  Share links to the Wappalyzer app from Chrome or any other
                  app.
                </li>
              </ol>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col>
          <v-card height="100%" class="d-flex flex-column">
            <v-card-title class="subtitle-2">
              <v-icon left>{{ mdi.mdiApple }}</v-icon> iOS app
            </v-card-title>
            <v-card-text>
              <ol>
                <li class="mb-2">
                  On your iOS device, open Safari and go to
                  <a href="https://twa.wappalyzer.com" target="_blank"
                    >twa.wappalyzer.com</a
                  >.
                </li>
                <li>
                  In the Share menu, click 'Add to Home Screen'.
                </li>
              </ol>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

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
  mdiAppleSafari,
  mdiApple,
  mdiAndroid,
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
        mdiAppleSafari,
        mdiApple,
        mdiAndroid,
      },
      meta,
      platforms: [
        {
          text: 'Chrome',
          href:
            'https://chrome.google.com/webstore/detail/wappalyzer/gppongmhjkpfnbhagpmjfkannfbllamg',
          icon: 'mdiGoogleChrome',
        },
        {
          text: 'Firefox',
          href: 'https://addons.mozilla.org/en-US/firefox/addon/wappalyzer/',
          icon: 'mdiFirefox',
        },
        {
          text: 'Edge',
          href:
            'https://microsoftedge.microsoft.com/addons/detail/mnbndgmknlpdjdnjfmfcdjoegcckoikn',
          icon: 'mdiMicrosoftEdge',
        },
        {
          text: 'Safari',
          href: 'https://apps.apple.com/app/wappalyzer/id1520333300',
          icon: 'mdiAppleSafari',
        },
      ],
    }
  },
}
</script>
