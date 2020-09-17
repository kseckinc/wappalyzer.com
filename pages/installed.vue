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

            <v-btn color="accent" to="/faq/extension/" outlined small>
              <v-icon left>{{ mdiForum }}</v-icon>
              Frequently asked questions
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </Page>
</template>

<script>
import { mdiForum } from '@mdi/js'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Installation successful',
      release: null,
      error: false,
      mdiForum,
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
