<template>
  <div>
    <Page :title="title" :head="meta" no-heading>
      <v-card flat>
        <v-card-text>
          <h2 class="mb-2 subtitle-2">Lookup API</h2>

          <p>
            Perform near-instant technology lookups with the Lookup API. Results
            are fetched from our comprehensive database of millions of websites.
            If we haven't seen a domain before, we'll index it immediately and
            report back within minutes.
          </p>

          <h3 class="mb-2 subtitle-2">Crawl API</h3>

          <p class="mb-0">
            Identify the technologies used on any public website in real-time.
            Results are always guaranteed up-to-date and delivered within
            minutes.
          </p>
        </v-card-text>
      </v-card>

      <div class="mt-4">
        <v-btn class="mb-2 mr-2" depressed @click="$refs.faqDialog.open()">
          <v-icon left>{{ mdiForum }}</v-icon>
          FAQs
        </v-btn>
        <v-btn to="/docs/api/" class="mb-2" depressed>
          <v-icon left>{{ mdiBookOpenPageVariant }}</v-icon>
          API reference
        </v-btn>
      </div>

      <template #content>
        <Matrix
          :items="apis"
          :attrs="attrs"
          button-text="Compare plans"
          class="mt-8"
        />

        <p class="text--disabled mb-8">
          <small>* Subject to availability</small>
        </p>

        <v-card class="mb-4" color="secondary">
          <v-card-title class="subtitle-2 pb-0 mb-n2"
            >Example request</v-card-title
          >
          <v-card-text>
            <pre><Code>
curl -H "x-api-key: &lt;your api key&gt;" \
"https://api.wappalyzer.com/lookup/v2/?urls=https://example.com&amp;sets=locale,social,contact"</Code></pre>
          </v-card-text>

          <v-divider />

          <v-card-title class="subtitle-2 pb-0 mb-n2"
            >Example response</v-card-title
          >

          <v-card-text>
            <pre><Code>
{
  "url": "https://example.com",
  "technologies": [
    {
      "slug": "craft-cms",
      "name": "Craft CMS",
      "versions": [ "3.0.0" ],
      "categories": [
        {
          "id": 1,
          "slug": "cms",
          "name": "CMS"
        }
      ]
      "trafficRank": 1000,
      "confirmedAt": 1612824037
    }
  ],
  "email": [ "info@example.com" ],
  "phone": [ "+1 (555) 555-5555" ],
  "linkedin": [ "company/example" ],
  "ipCountry": "US",
  "ipRegion": "CA",
  "language": "en"
}</Code></pre>
          </v-card-text>
        </v-card>
      </template>

      <FaqDialog ref="faqDialog" topic="api" />

      <template #footer>
        <Logos apps />
      </template>
    </Page>
  </div>
</template>

<script>
import { mdiForum, mdiBookOpenPageVariant } from '@mdi/js'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import Matrix from '~/components/Matrix.vue'
import FaqDialog from '~/components/FaqDialog.vue'
import Code from '~/components/Code.vue'
import { attrs, apis } from '~/assets/json/apis.json'
import { apis as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Page,
    Logos,
    Matrix,
    FaqDialog,
    Code,
  },
  data() {
    return {
      title: meta.title,
      attrs,
      apis,
      faqDialog: false,
      meta,
      mdiForum,
      mdiBookOpenPageVariant,
    }
  },
}
</script>
