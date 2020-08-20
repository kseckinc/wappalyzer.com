<template>
  <div>
    <Page :title="title" :head="meta" hero no-heading>
      <div class="mt-8">
        <v-btn color="accent" to="/faq/api" class="mb-2" outlined>
          <v-icon left>mdi-forum</v-icon>
          FAQs
        </v-btn>
        <v-btn
          color="accent"
          href="https://wappalyzer.com/docs/api"
          class="mb-2"
          outlined
        >
          <v-icon left>mdi-book-open-page-variant</v-icon>
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

            <pre><Prism language="bash" class="body-2">curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/lookup/v2/?urls=https://example.com&amp;sets=locale,social,contact"</Prism></pre>
          </v-col>
          <v-col md="6">
            <h3>Example response</h3>

            <pre><Prism language="json" class="body-2">{
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
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import Matrix from '~/components/Matrix.vue'
import { attrs, apis } from '~/assets/json/apis.json'
import { apis as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Page,
    Logos,
    Matrix
  },
  data() {
    return {
      title: meta.title,
      attrs,
      apis,
      meta
    }
  }
}
</script>
