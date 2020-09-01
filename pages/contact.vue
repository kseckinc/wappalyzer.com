<!-- eslint-disable vue/no-v-html -->
<template>
  <Page :title="title">
    <v-row>
      <v-col md="10" lg="8" class="py-0">
        <p class="mb-8">
          We love to hear from you. Please don't hesitate to email us with any
          comments, questions and suggestions.
        </p>

        <v-btn to="/faq/extension" color="accent" outlined>
          <v-icon left>{{ mdi.mdiForum }}</v-icon>
          Frequently asked questions
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-8 mb-4">
      <v-col v-for="item in items" :key="item.title" cols="12" md="4">
        <v-card height="100%" class="d-flex flex-column">
          <v-card-title class="subtitle-2">
            <v-icon left>{{ mdi[item.icon] }}</v-icon>
            {{ item.title }}
          </v-card-title>
          <v-card-text v-html="item.text" />
          <v-spacer />
          <v-card-actions>
            <v-spacer />
            <v-btn :href="item.button.href" color="accent" text>
              <v-icon left>{{ mdi[item.button.icon] }}</v-icon>
              {{ item.button.text }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="8">
        <v-card flat>
          <v-card-text class="pa-0">
            <h3 class="mb-2">Social media</h3>

            <p class="mb-4">
              Follow us on LinkedIn and Twitter for occasional product updates.
            </p>

            <v-btn
              href="https://www.linkedin.com/company/wappalyzer"
              color="accent"
              class="mr-2"
              target="_blank"
              outlined
              small
            >
              <v-icon left>{{ mdi.mdiLinkedin }}</v-icon>
              LinkedIn
            </v-btn>
            <v-btn
              href="https://twitter.com/Wappalyzer"
              color="accent"
              target="_blank"
              outlined
              small
            >
              <v-icon left>{{ mdi.mdiTwitter }}</v-icon>
              Twitter
            </v-btn>

            <h3 id="affiliates" class="mt-8 mb-2">
              Become an affiliate partner
            </h3>

            <p>
              Email us to become an affiliate partner. We pay 30% recurring
              commission on referrals from any user who signs up using your
              unique link. You'll be able to track sales using a personal
              dashboard.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </Page>
</template>

<script>
import {
  mdiTwitter,
  mdiGithub,
  mdiLinkedin,
  mdiSlack,
  mdiEmailOutline,
  mdiFaceAgent,
  mdiBug,
  mdiChatOutline,
  mdiForum,
} from '@mdi/js'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Get in touch',
      items: [
        {
          title: 'Sales and support',
          icon: 'mdiFaceAgent',
          text:
            'Email us at <a href="mailto:info@wappalyzer.com">info@wappalyzer.com</a> for sales enquiries and technical support for paid products, or just to say hi.',
          button: {
            icon: 'mdiEmailOutline',
            href: 'mailto:info@wappalyzer.com',
            text: 'Email us',
          },
        },
        {
          title: 'Bugs and feature requests',
          icon: 'mdiBug',
          text:
            'Did you find a bug with the browser extension or Node.js module, or want to request a new feature? Please create an issue on GitHub.',
          button: {
            icon: 'mdiGithub',
            href: 'https://github.com/AliasIO/wappalyzer/issues/new/choose',
            text: 'Create an issue',
          },
        },
        {
          title: 'Technical discussion',
          icon: 'mdiChatOutline',
          text:
            'Join us on Slack for technical discussion about the browser extension and Node.js module.',
          button: {
            icon: 'mdiSlack',
            href:
              'https://join.slack.com/t/wappalyzer/shared_invite/enQtMjc1MzA2NzE4NzkwLTA5Y2RmMTQxMTFhYzViODQzMzUyNGFkMWIzY2ZhZmFlOWY2NTcyZWY4OWVjYzhiY2JhZTZlMzBiNThlMWJiMjU',
            text: 'Join us on Slack',
          },
        },
      ],
      mdi: {
        mdiTwitter,
        mdiGithub,
        mdiLinkedin,
        mdiSlack,
        mdiEmailOutline,
        mdiFaceAgent,
        mdiBug,
        mdiChatOutline,
        mdiForum,
      },
    }
  },
}
</script>
