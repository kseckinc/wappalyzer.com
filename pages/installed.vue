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

            <v-btn depressed @click="$refs.faqDialog.open()">
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

    <FaqDialog ref="faqDialog" topic="extension" />
  </Page>
</template>

<script>
import { mdiForum } from '@mdi/js'

import Page from '~/components/Page.vue'
import FaqDialog from '~/components/FaqDialog.vue'

export default {
  components: {
    Page,
    FaqDialog,
  },
  data() {
    return {
      title: 'Installation successful',
      release: null,
      error: false,
      mdiForum,
    }
  },
}
</script>
