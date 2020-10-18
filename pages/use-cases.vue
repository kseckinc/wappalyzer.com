<!-- eslint-disable vue/no-v-html -->
<template>
  <Page :title="title" no-head>
    <UseCases />

    <v-divider class="my-4 my-sm-6" />

    <v-row id="lead-generation" align="stretch">
      <v-col cols="12" md="5">
        <h2 class="text-h2 d-flex align-center mb-n2 mb-md-4 primary--text">
          Lead generation
        </h2>
      </v-col>
      <v-col cols="12" md="7">
        <p>
          Find new prospects by the technologies they use. We track the
          technology stacks of millions of websites globally and capture any
          email addresses, phone numbers and social media profiles we find.
        </p>

        <p>
          Create and export custom reports for
          <nuxt-link to="/technologies/">any web technology</nuxt-link> based on
          website traffic, location and language.
        </p>

        <p>
          Our technology data is of a high standard and updated continuously.
        </p>

        <v-row>
          <v-col cols="12" sm="4" class="py-0">
            <p class="overline mb-1">Products</p>

            <ul class="body-2 mb-4">
              <li><nuxt-link to="/lists/">Lead lists</nuxt-link></li>
            </ul>
          </v-col>
          <v-col class="py-0">
            <p class="overline mb-1">Articles</p>

            <ul class="body-2 mb-4">
              <li>
                <nuxt-link to="/articles/what-is-technographics/"
                  >What is technographics?</nuxt-link
                >
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-divider class="mt-2 mb-4 mt-md-4 mb-md-6" />

    <v-row id="market-research" align="stretch">
      <v-col cols="12" md="5">
        <h2 class="text-h2 d-flex align-center mb-n2 mb-md-4 primary--text">
          Market research
        </h2>
      </v-col>
      <v-col cols="12" md="7">
        <p>
          We track web technologies in dozens of categories, such as
          <nuxt-link to="/technologies/ecommerce/"
            >ecommerce platforms</nuxt-link
          >,
          <nuxt-link to="/technologies/cms/"
            >content management systems</nuxt-link
          >
          and
          <nuxt-link to="/technologies/crm/"
            >customer relationship management</nuxt-link
          >
          software. Compare market shares by install base and website traffic,
          segmented by location and language.
        </p>

        <v-row>
          <v-col cols="12" sm="4" class="py-0">
            <p class="overline mb-1">Products</p>

            <ul class="body-2 mb-4">
              <li><nuxt-link to="/lists/">Lead lists</nuxt-link></li>
              <li><nuxt-link to="/lookup/">Technology lookup</nuxt-link></li>
              <li><nuxt-link to="/bulk/">Bulk lookup</nuxt-link></li>
              <li><nuxt-link to="/download/">Browser extension</nuxt-link></li>
            </ul>
          </v-col>
          <v-col class="py-0">
            <p class="overline mb-1">Case studies</p>

            <ul class="body-2 mb-4">
              <li>
                <nuxt-link
                  to="/articles/http-archive-uses-wappalyzer-to-track-the-state-of-the-web/"
                >
                  HTTP Archive uses Wappalyzer to track the state of the web
                </nuxt-link>
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-divider class="mt-2 mb-4 mt-md-4 mb-md-6" />

    <v-row id="competitor-analysis" align="stretch">
      <v-col cols="12" md="5">
        <h2 class="text-h2 d-flex align-center mb-n2 mb-md-4 primary--text">
          Competitor analysis
        </h2>
      </v-col>
      <v-col cols="12" md="7">
        <p>
          Discover who's using your software and that of your competitors.
          Instantly find out the technology stack of your competition's
          websites, individually or in bulk. Monitor your prospects' technology
          choices. Automate technology lookups and real-time analysis with our
          highly scalable APIs.
        </p>

        <p class="overline mb-1">Products</p>

        <v-row>
          <v-col cols="12" sm="4" class="py-0">
            <ul class="body-2 mb-4">
              <li><nuxt-link to="/lookup/">Technology lookup</nuxt-link></li>
              <li><nuxt-link to="/bulk/">Bulk lookup</nuxt-link></li>
              <li><nuxt-link to="/download/">Browser extension</nuxt-link></li>
            </ul>
          </v-col>
          <v-col class="py-0">
            <ul class="body-2 mb-4">
              <li><nuxt-link to="/alerts/">Website alerts</nuxt-link></li>
              <li><nuxt-link to="/api/">Lookup API</nuxt-link></li>
              <li><nuxt-link to="/api/">Crawl API</nuxt-link></li>
            </ul>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-divider class="mt-2 mb-4 mt-md-4 mb-md-6" />

    <v-row id="data-enrichment" align="stretch">
      <v-col cols="12" md="5">
        <h2 class="text-h2 d-flex align-center mb-n2 mb-md-4 primary--text">
          Data enrichment
        </h2>
      </v-col>
      <v-col cols="12" md="7">
        <p>
          Bring your own list of websites and we'll enrich it with technology
          and contact data. Any websites we don't have readily available results
          for are be crawled and scanned immediately.
        </p>

        <p class="overline mb-1">Products</p>

        <ul class="body-2 mb-4">
          <li><nuxt-link to="/bulk/">Bulk lookup</nuxt-link></li>
          <li><nuxt-link to="/api/">Lookup API</nuxt-link></li>
          <li><nuxt-link to="/api/">Crawl API</nuxt-link></li>
        </ul>
      </v-col>
    </v-row>

    <v-divider class="mt-2 mb-4 mt-md-4 mb-md-6" />

    <v-row id="security-recon" align="stretch">
      <v-col cols="12" md="5">
        <h2 class="text-h2 d-flex align-center mb-n2 mb-md-4 primary--text">
          Security reconnaissance
        </h2>
      </v-col>
      <v-col cols="12" md="7">
        <p>
          Our tools are widely used by professionals in the infosec community
          for information gathering, reconnaissance and software idenification.
          Wappalyzer is integrated with industry leading security assessment
          tools like
          <a href="https://www.zaproxy.org/" rel="noopener" target="_blank"
            >OWASP ZAP</a
          >. Unlike many other technology profilers, we capture software version
          numbers as well.
        </p>

        <p class="overline mb-1">Products</p>

        <ul class="body-2 mb-4">
          <li><nuxt-link to="/download/">Browser extension</nuxt-link></li>
          <li><nuxt-link to="/api/">Lookup API</nuxt-link></li>
          <li><nuxt-link to="/api/">Crawl API</nuxt-link></li>
        </ul>
      </v-col>
    </v-row>

    <template v-slot:footer>
      <Logos />
    </template>
  </Page>
</template>

<script>
import {
  mdiFileTableOutline,
  mdiAccountMultiple,
  mdiFinance,
  mdiHandshakeOutline,
  mdiSecurity,
} from '@mdi/js'

import UseCases from '~/components/UseCases.vue'
import Logos from '~/components/Logos.vue'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
    UseCases,
    Logos,
  },
  data() {
    return {
      title: 'Use cases',
      mdiHandshakeOutline,
      mdiFinance,
      mdiAccountMultiple,
      mdiFileTableOutline,
      mdiSecurity,
    }
  },
}
</script>
