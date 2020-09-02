<template>
  <div>
    <Page :title="title" narrow>
      <v-card class="mb-4">
        <template v-for="(article, index) in articles">
          <div :key="index">
            <v-divider v-if="index" class="mb-2" />

            <v-card-title>
              <nuxt-link
                :to="article.to"
                class="text-decoration-none text--primary"
                >{{ article.title }}</nuxt-link
              >
            </v-card-title>

            <v-card-text class="pb-0">
              {{ article.intro }}
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn :to="article.to" color="accent" text>
                Read article
                <v-icon right small>{{ mdiArrowRight }}</v-icon>
              </v-btn>
            </v-card-actions>
          </div>
        </template>
      </v-card>
    </Page>
  </div>
</template>

<script>
import { mdiArrowRight } from '@mdi/js'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Articles',
      articles: [
        {
          title: 'What is technographics?',
          intro: `Technographics is a market research methodology used to profile target accounts based on their technology stack. For many companies, especially those offering a SaaS product, the technology a prospect uses can be a strong qualifying factor.`,
          to: '/articles/what-is-technographics/',
        },
        {
          title: 'Find out what CMS or framework a website is using',
          intro: `Whether you're a developer, online marketer, security researcher or SEO consultant, you've likely looked at a website and wondered 'what CMS is this website using'? There are several ways to check the technology of a website, which we'll explore in detail.`,
          to: '/articles/find-out-what-cms-or-framework-a-website-is-using/',
        },
        {
          title: 'How to hide technologies from Wappalyzer',
          intro: `Most web technologies, including server-side software such as CMSs, leave trails of evidence of their presence in websites' HTML code. This code is publicly accessible, which is necessary for browsers to render and display the page. Wappalyzer is known to be very proficient exposing these technologies through various fingerprinting methods.`,
          to: '/articles/how-to-hide-technologies-from-wappalyzer/',
        },
        {
          title: 'Wappalyzer vs. BuiltWith and Datanyze',
          intro: `Wappalyzer, BuiltWith and Datanyze are data vendors that scan websites to identify technologies. When looking for providers in the technographics space, Wappalyzer is often mentioned as a BuiltWith alternative or Datanyze alternative.`,
          to: '/articles/wappalyzer-vs-builtwith-and-datanyze/',
        },
      ],
      mdiArrowRight,
    }
  },
}
</script>
