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
        <v-btn color="accent" class="mb-2" outlined @click="faqDialog = true">
          <v-icon left>{{ mdiForum }}</v-icon>
          FAQs
        </v-btn>
        <v-btn color="accent" to="/docs/api/" class="mb-2" outlined>
          <v-icon left>{{ mdiBookOpenPageVariant }}</v-icon>
          API reference
        </v-btn>
      </div>

      <template v-slot:content>
        <Matrix
          :items="apis"
          :attrs="attrs"
          button-text="Compare plans"
          class="mt-8"
        />

        <v-container>
          <small>* Subject to availability</small>
        </v-container>

        <v-row class="mb-4 mt-4 mt-sm-8">
          <v-col md="6">
            <h3>Example request</h3>

            <small>
              <pre><Prism language="bash">curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/lookup/v2/?urls=https://example.com&amp;sets=locale,social,contact"</Prism></pre>
            </small>
          </v-col>
          <v-col md="6">
            <h3>Example response</h3>

            <small>
              <pre><Prism language="json">{
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
    }
  ],
  "email": [ "info@example.com" ],
  "phone": [ "+1 (555) 555-5555" ],
  "linkedin": [ "company/example" ],
  "ipCountry": "US",
  "ipRegion": "CA",
  "language": "en"
}</Prism></pre>
            </small>
          </v-col>
        </v-row>
      </template>

      <v-dialog v-model="faqDialog" max-width="600px">
        <v-card>
          <v-card-title>
            Frequently asked questions
          </v-card-title>
          <v-card-text class="pb-0">
            <Faqs topic="api" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="faqDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <template v-slot:footer>
        <Logos integrations />
      </template>
    </Page>
  </div>
</template>

<script>
import { mdiForum, mdiBookOpenPageVariant } from '@mdi/js'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import Matrix from '~/components/Matrix.vue'
import Faqs from '~/components/Faqs.vue'
import { attrs, apis } from '~/assets/json/apis.json'
import { apis as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Page,
    Logos,
    Matrix,
    Faqs,
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
