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
              >
                {{ article.title }}
              </nuxt-link>
            </v-card-title>

            <v-card-text style="max-width: 600px">
              {{ article.intro }}
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn :to="article.to" color="accent" text>
                Read article
                <v-icon right small>
                  {{ mdiArrowRight }}
                </v-icon>
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
          title:
            'Get the technology stack of new leads to your Slack instantly',
          intro:
            "Lead qualification can be a long process with many steps. Save time by automating research into your clients' current technical stack. So when a client wants your help in updating their website, you'll instantly know what CMS or framework they are using without having to ask the client first.",
          to: '/articles/get-the-technology-stack-of-new-leads-in-slack/',
        },
        {
          title: 'HTTP Archive uses Wappalyzer to track the state of the web',
          intro:
            'The HTTP Archive tracks how the web is built. It provides historical data to quantitatively illustrate how the web is evolving over time. The project is open-source and backed by technology giants such as Google, Mozilla and Akamai.',
          to: '/articles/http-archive-uses-wappalyzer-to-track-the-state-of-the-web/',
        },
        {
          title: 'What is technographics?',
          intro:
            'Technographics is a market research methodology used to profile target accounts based on their technology stack. For many companies, especially those offering a SaaS product, the technology a prospect uses can be a strong qualifying factor.',
          to: '/articles/what-is-technographics/',
        },
        {
          title: 'Find out what CMS or framework a website is using',
          intro:
            "Whether you're a developer, online marketer, security researcher or SEO consultant, you've likely looked at a website and wondered 'what CMS is this website using'? There are several ways to check the technology of a website, which we'll explore in detail.",
          to: '/articles/find-out-what-cms-or-framework-a-website-is-using/',
        },
        {
          title: 'How to hide technologies from Wappalyzer',
          intro:
            "Most web technologies, including server-side software such as CMSs, leave trails of evidence of their presence in websites' HTML code. This code is publicly accessible, which is necessary for browsers to render and display the page. Wappalyzer is known to be very proficient exposing these technologies through various fingerprinting methods.",
          to: '/articles/how-to-hide-technologies-from-wappalyzer/',
        },
        {
          title: 'Wappalyzer vs. BuiltWith',
          intro:
            "Wappalyzer and BuiltWith are technology profilers that provide tools for lead generation, market research and business intelligence. Looking for a comparison between Wappalyzer and BuiltWith? Here's a full review.",
          to: '/articles/builtwith-alternative/',
        },
      ],
      mdiArrowRight,
    }
  },
}
</script>
