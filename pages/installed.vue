<template>
  <Page
    :title="title"
    :hero="{
      title: 'Wappalyzer has been installed',
      subtitle: 'Thank you for installing the browser extension!',
    }"
    :crumbs="false"
    no-head
  >
    <v-row justify="center" class="my-4">
      <v-col cols="12" sm="8" lg="6" class="py-0">
        <v-card>
          <v-card-title>How it works</v-card-title>
          <v-card-text>
            <ol class="mb-8">
              <li>Go to any website</li>
              <li>Click the icon for a list of identified technologies</li>
              <li>Click on a technology or category for more insights</li>
            </ol>

            <v-btn depressed @click="faqDialog = true">
              <v-icon left>
                {{ mdiForum }}
              </v-icon>
              Frequently asked questions
            </v-btn>
          </v-card-text>
          <v-card-title class="subtitle-2"> Watch the video </v-card-title>
          <v-card-text>
            <iframe
              src="https://player.vimeo.com/video/468326761"
              class="mb-n1"
              width="100%"
              height="302"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="faqDialog" max-width="600px">
      <v-card>
        <v-card-title> Frequently asked questions </v-card-title>
        <v-card-text class="pb-0">
          <Faqs topic="extension" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="faqDialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import { mdiForum } from '@mdi/js'

import Page from '~/components/Page.vue'
import Faqs from '~/components/Faqs.vue'

export default {
  components: {
    Page,
    Faqs,
  },
  data() {
    return {
      title: 'Installation successful',
      faqDialog: false,
      release: null,
      error: false,
      mdiForum,
    }
  },
}
</script>
