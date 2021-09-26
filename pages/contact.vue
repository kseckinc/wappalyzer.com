<!-- eslint-disable vue/no-v-html -->
<template>
  <Page :title="title" no-head narrow>
    <v-row align="center" justify="space-between">
      <v-col cols="12" md="9" lg="8">
        <h1 class="mt-n2 mb-2">{{ title }}</h1>

        <p>
          We love to hear from you. Please don't hesitate to email us with any
          comments, questions and suggestions.
        </p>

        <v-btn class="mt-4" to="/faq/lists/" depressed>
          <v-icon left>
            {{ mdiForum }}
          </v-icon>
          Frequently asked questions
        </v-btn>
      </v-col>
      <v-col class="d-none d-md-block" cols="12" md="2" lg="3">
        <v-img :src="`/images/contact.png`" width="100%" contain />
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="6">
        <h3 class="mb-2">Email us</h3>

        <p class="body-2">
          Email us at
          <a href="mailto:hello@wappalyzer.com">hello@wappalyzer.com</a> for
          sales enquiries and technical support for paid products, or just to
          say hi.
        </p>
      </v-col>
      <v-col cols="6">
        <h3 class="mb-2">Follow us</h3>
        <p class="body-2">
          Follow us on social media for occasional product updates.
        </p>

        <a
          href="https://www.facebook.com/wappalyzer"
          target="_blank"
          rel="noopener"
          icon
        >
          <v-icon color="accent" size="20" left>{{ mdiFacebook }}</v-icon>
        </a>
        <a
          href="https://www.instagram.com/wappalyzer"
          target="_blank"
          rel="noopener"
          icon
        >
          <v-icon color="accent" size="20" left>{{ mdiInstagram }}</v-icon>
        </a>
        <a
          href="https://twitter.com/Wappalyzer"
          target="_blank"
          rel="noopener"
          icon
        >
          <v-icon color="accent" size="20" left>{{ mdiTwitter }}</v-icon>
        </a>
        <a
          href="https://www.linkedin.com/company/wappalyzer"
          target="_blank"
          rel="noopener"
          icon
        >
          <v-icon color="accent" size="20" left>{{ mdiLinkedin }}</v-icon>
        </a>
      </v-col>
      <v-col cols="6">
        <h3 class="mb-2">Chat with us</h3>

        <p class="body-2">
          We're located in Melbourne, Australia and generally available between
          8am-8pm AEST.
        </p>

        <p class="body-2">
          Right now it's
          {{
            new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Australia/Melbourne',
            })
          }}
          AEST.
        </p>

        <p class="body-2"><a @click.prevent="chat">Start a chat</a>.</p>
      </v-col>
    </v-row>
  </Page>
</template>

<script>
/* globals $crisp */

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
  methods: {
    chat() {
      $crisp.push(['do', 'chat:open'])
    },
  },
}
</script>
