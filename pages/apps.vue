<template>
  <div>
    <Page :title="title" :head="meta">
      <v-btn class="mt-4 mb-6" depressed @click="$refs.faqDialog.open()">
        <v-icon left>{{ mdi.mdiForum }}</v-icon>
        FAQs
      </v-btn>

      <Apps />

      <v-divider class="mt-12 mb-10" />

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
        <v-col class="py-0">
          <v-card height="100%" class="d-flex flex-column" flat>
            <v-card-title class="subtitle-2">
              <v-icon left>{{ mdi.mdiAndroid }}</v-icon>
              Android app
            </v-card-title>
            <v-card-text>
              <ol class="mb-4">
                <li class="mb-2">
                  Install Wappalyzer from the
                  <a
                    href="https://play.google.com/store/apps/details?id=com.wappalyzer.twa"
                    target="_blank"
                    rel="noopener"
                    >Google Play store</a
                  >.
                </li>
              </ol>

              <p>Or:</p>

              <ol>
                <li class="mb-2">
                  On your Android device, open Chrome and go to
                  <a href="https://twa.wappalyzer.com" target="_blank"
                    >twa.wappalyzer.com</a
                  >.
                </li>
                <li class="mb-2">In the menu, click 'Add to Home screen'.</li>
              </ol>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col class="py-0">
          <v-card height="100%" class="d-flex flex-column" flat>
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
                <li>In the Share menu, click 'Add to Home Screen'.</li>
              </ol>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </Page>

    <FaqDialog ref="faqDialog" topic="extension" />
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
import FaqDialog from '~/components/FaqDialog.vue'
import Apps from '~/components/Apps.vue'

export default {
  components: {
    Page,
    FaqDialog,
    Apps,
  },
  data() {
    return {
      title: 'Apps',
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
      meta: {
        title: 'Apps',
        text: [
          'Wappalyzer works with the tools you use every day.',
          'Install the free browser extension to see the technologies used on websites you visit or install Wappalyzer in your CRM to see the technologies used by your leads.',
        ],
      },
    }
  },
}
</script>
