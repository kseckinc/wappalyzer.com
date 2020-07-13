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
        <Matrix :items="apis" :attrs="attrs" button-text="Read more" />

        <v-container>
          <small>* Subject to availability</small>
        </v-container>

        <v-row class="mb-4 mt-4 mt-sm-8">
          <v-col md="6">
            <h3>Example request (cURL)</h3>

            <v-card class="code mt-4" dark>
              <v-card-text>
                <pre class="code__block code__block--wrap">
<span class="code__key">curl</span> -H <span class="code__value">"x-api-key: wappalyzer.api.demo.key"</span> <span class="code__value">"https://api.wappalyzer.com/lookup/v1/?url=https://example.com"</span></pre>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="6">
            <h3>Example response (JSON)</h3>

            <v-card class="code mt-4" dark>
              <v-card-text>
                <pre class="code__block">
[
  {
    <span class="code__key">"monthYear"</span>: <span class="code__value">"01-2020"</span>,
    <span class="code__key">"languages"</span>: [
      <span class="code__value">"en_US"</span>
    ],
    <span class="code__key">"applications"</span>: [
      {
        <span class="code__key">"name"</span>: <span class="code__value">"Craft CMS"</span>,
        <span class="code__key">"categories"</span>: [
          <span class="code__value">"CMS"</span>
        ],
        <span class="code__key">"versions"</span>: [
          <span class="code__value">"3.0.0"</span>
        ],
        <span class="code__key">"hits"</span>: <span class="code__value">5000</span>
      }
    ]
  }
]</pre>
              </v-card-text>
            </v-card>
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

<style>
.code {
  background-color: #282c34 !important;
}

.code__block {
  line-height: 1.1rem;
}

.code__block--wrap {
  white-space: normal;
}

.code__key {
  color: #f8c555;
}

.code__value {
  color: #7ec699;
}
</style>
