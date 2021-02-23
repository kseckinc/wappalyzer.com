<!-- eslint-disable vue/no-v-html -->
<template>
  <Page :title="title" narrow>
    <p class="mb-8">
      We love to hear from you. Please don't hesitate to email us with any
      comments, questions and suggestions.
    </p>

    <v-btn to="/faq/extension/" color="accent" outlined>
      <v-icon left>{{ mdiForum }}</v-icon>
      Frequently asked questions
    </v-btn>

    <v-row class="mt-8 mb-4">
      <v-col cols="12" md="6">
        <v-card height="100%" class="d-flex flex-column">
          <v-card-title class="subtitle-2">
            <v-icon left>{{ mdiFaceAgent }}</v-icon>

            Sales &amp; support
          </v-card-title>
          <v-card-text class="pb-0">
            Email us at
            <a href="mailto:info@wappalyzer.com">info@wappalyzer.com</a> for
            sales enquiries and technical support for paid products, or just to
            say hi.
          </v-card-text>
          <v-spacer />
          <v-card-actions>
            <v-spacer />
            <v-btn href="mailto:info@wappalyzer.com" color="accent" text>
              <v-icon left>{{ mdiEmail }}</v-icon>
              Email us</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card height="100%" class="d-flex flex-column">
          <v-card-title class="subtitle-2">
            <v-icon left>{{ mdiThumbUpOutline }}</v-icon>

            Follow us
          </v-card-title>
          <v-card-text class="pb-0">
            Follow us on social media for occasional product updates.
          </v-card-text>
          <v-spacer />
          <v-card-actions>
            <v-spacer />
            <v-btn
              href="https://www.facebook.com/wappalyzer"
              color="accent"
              target="_blank"
              rel="noopener"
              icon
              ><v-icon>{{ mdiFacebook }}</v-icon></v-btn
            >
            <v-btn
              href="https://www.instagram.com/wappalyzer"
              color="accent"
              target="_blank"
              rel="noopener"
              icon
              ><v-icon>{{ mdiInstagram }}</v-icon></v-btn
            >
            <v-btn
              href="https://twitter.com/Wappalyzer"
              color="accent"
              target="_blank"
              rel="noopener"
              icon
              ><v-icon>{{ mdiTwitter }}</v-icon></v-btn
            >
            <v-btn
              href="https://www.linkedin.com/company/wappalyzer"
              color="accent"
              target="_blank"
              rel="noopener"
              icon
              ><v-icon>{{ mdiLinkedin }}</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </Page>
</template>

<script>
import {
  mdiTwitter,
  mdiLinkedin,
  mdiFacebook,
  mdiInstagram,
  mdiEmail,
  mdiFaceAgent,
  mdiForum,
  mdiThumbUpOutline,
} from '@mdi/js'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Get in touch',
      mdiTwitter,
      mdiLinkedin,
      mdiFacebook,
      mdiInstagram,
      mdiEmail,
      mdiFaceAgent,
      mdiForum,
      mdiThumbUpOutline,
    }
  },
}
</script>
