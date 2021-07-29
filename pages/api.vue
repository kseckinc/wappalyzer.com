<template>
  <div>
    <Page :title="title" :head="meta" no-heading>
      <div style="max-width: 600px">
        <h4 class="mt-6 d-flex align-center overline font-weight-bold">
          Lookup API
        </h4>

        <p class="body-2">
          Perform near-instant technology lookups with the Lookup API. Results
          are fetched from our comprehensive database of millions of websites.
          If we haven't seen a domain before, we'll index it immediately and
          report back within minutes.
          <nuxt-link class="" to="/docs/api/v2/lookup/">Read more</nuxt-link>.
        </p>

        <h4 class="mt-6 d-flex align-center overline font-weight-bold">
          Live API
        </h4>

        <p class="body-2">
          Identify the technologies used on any public website in real-time.
          Results are always guaranteed up-to-date and delivered within minutes.
          <nuxt-link class="" to="/docs/api/v2/live/">Read more</nuxt-link>.
        </p>

        <h4 class="mt-6 d-flex align-center overline font-weight-bold">
          Verify API
        </h4>

        <p class="body-2">
          Verify email addresses before sending to improve delivery. A high
          bounce rate lowers your sender reputation and you risk getting blocked
          by email providers.
          <nuxt-link class="" to="/docs/api/v2/verify/">Read more</nuxt-link>.
        </p>
      </div>

      <div class="mt-8">
        <v-btn class="mb-2 mr-2" depressed @click="$refs.faqDialog.open()">
          <v-icon left>
            {{ mdiForum }}
          </v-icon>
          FAQs
        </v-btn>
        <v-btn to="/docs/api/" class="mb-2" depressed>
          <v-icon left>
            {{ mdiBookOpenPageVariant }}
          </v-icon>
          API reference
        </v-btn>
      </div>

      <template #content>
        <Matrix
          :items="apis"
          :attrs="attrs"
          button-text="Plans & pricing"
          class="mt-8"
        />

        <p class="text--disabled mb-12">
          <small>* Subject to availability</small>
        </p>

        <h2 class="text-center mt-n2 mb-6">Example responses</h2>

        <v-row justify="center" class="mb-4">
          <v-col cols="12" md="10" lg="8">
            <v-card>
              <v-tabs
                v-model="tab"
                slider-color="primary"
                background-color="secondary"
                active-class="primary--text"
                centered
              >
                <v-tab><small>Lookup API</small></v-tab>
                <v-tab><small>Live API</small></v-tab>
                <v-tab><small>Verify API</small></v-tab>
              </v-tabs>

              <v-divider />

              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <v-card>
                    <v-card-title class="subtitle-2 pb-0 mb-n2">
                      Example request
                    </v-card-title>
                    <v-card-text>
                      <pre><Code>
curl -H "x-api-key: &lt;your api key&gt;" \
"https://api.wappalyzer.com/lookup/v2/?urls=https://www.wappalyzer.com&amp;sets=all"</Code></pre>
                    </v-card-text>

                    <v-divider />

                    <v-card-title class="subtitle-2 pb-0 mb-n2">
                      Example response
                    </v-card-title>

                    <v-card-text>
                      <pre><Code>
{
  "url": "https://www.wapplyzer.com",
  "technologies": [
    {
      "slug": "stripe",
      "name": "Stripe",
      "versions": [ "3" ],
      "categories": [
        {
          "id": 1,
          "slug": "payment-processors",
          "name": "Payment processors"
        }
      ],
      "trafficRank": 1000,
      "confirmedAt": 1612824037
    },
    ...
  ],
  "email": [ "hello@wappalyzer.com", "elbert@wappalyzer.com" ],
  "verifiedEmail": [ "hello@wappalyzer.com", "elbert@wappalyzer.com" ],
  "safeEmail": [ "elbert@wappalyzer.com" ],
  "phone": [ "+61 ..." ],
  "linkedin": [ "company/wappalyzer", "in/elbertalias" ],
  "twitter": [ "Wappalyzer" ],
  "facebook": [ "wappalyzer" ],
  "title": "Find out what websites are built with",
  "description": "Find out the technology stack of any website.",
  "companyName": "Wappalyzer",
  "inferredCompanyName": "WAPPALYZER",
  "industry": "Internet",
  "about": "Wappalyzer uncovers the technologies used on websites.",
  "locations": [ "Melbourne, VIC 3000, AU" ],
  "companySize": "2-10 employees",
  "companyType": "Privately Held",
  "companyFounded": 2008,
  "employees": [
    {
      "name": "Elbert Alias",
      "title": "Founder of Wappalyzer"
    },
    ...
  ],
  "keywords": [ "WAPPALYZER", "TECHNOLOGY", "WEBSITES", ... ],
  "schemaOrgTypes": [ "WebPage", "Organization" ],
  "certInfo.issuer": "Amazon",
  "certInfo.validTo": 1633737600,
  "certInfo.protocol": "TLS 1.3"
  "dns.spf": true,
  "dns.dmarc": true,
  "ipCountry": "US",
  "ipRegion": "WA",
  "language": "en",
  "responsive": true
}</Code></pre>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card>
                    <v-card-title class="subtitle-2 pb-0 mb-n2">
                      Example request
                    </v-card-title>
                    <v-card-text>
                      <pre><Code>
curl -H "x-api-key: &lt;your api key&gt;" \
"https://api.wappalyzer.com/live/v2/?urls=https://www.wappalyzer.com&amp;sets=all"</Code></pre>
                    </v-card-text>

                    <v-divider />

                    <v-card-title class="subtitle-2 pb-0 mb-n2">
                      Example response
                    </v-card-title>

                    <v-card-text>
                      <pre><Code>
{
  "url": "https://www.wapplyzer.com",
  "technologies": [
    {
      "slug": "stripe",
      "name": "Stripe",
      "versions": [ "3" ],
      "categories": [
        {
          "id": 1,
          "slug": "payment-processors",
          "name": "Payment processors"
        }
      ],
      "trafficRank": 1000,
      "confirmedAt": 1612824037
    },
    ...
  ],
  "email": [ "hello@wappalyzer.com", "elbert@wappalyzer.com" ],
  "phone": [ "+61 ..." ],
  "linkedin": [ "company/wappalyzer", "in/elbertalias" ],
  "twitter": [ "Wappalyzer" ],
  "facebook": [ "wappalyzer" ],
  "title": "Find out what websites are built with",
  "description": "Find out the technology stack of any website.",
  "inferredCompanyName": "WAPPALYZER",
  "keywords": [ "WAPPALYZER", "TECHNOLOGY", "WEBSITES", ... ],
  "schemaOrgTypes": [ "WebPage", "Organization" ],
  "certInfo.issuer": "Amazon",
  "certInfo.validTo": 1633737600,
  "certInfo.protocol": "TLS 1.3"
  "dns.spf": true,
  "dns.dmarc": true,
  "ipCountry": "US",
  "ipRegion": "WA",
  "language": "en",
  "responsive": true
}</Code></pre>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card>
                    <v-card-title class="subtitle-2 pb-0 mb-n2">
                      Example request
                    </v-card-title>
                    <v-card-text>
                      <pre><Code>
curl -H "x-api-key: &lt;your api key&gt;" \
"https://api.wappalyzer.com/verify/v2/?email=hello@wappalyzer.com"</Code></pre>
                    </v-card-text>

                    <v-divider />

                    <v-card-title class="subtitle-2 pb-0 mb-n2">
                      Example response
                    </v-card-title>

                    <v-card-text>
                      <pre><Code>
{
  "email": "hello@wappalyzer.com",
  "domain": "wappalyzer.com",
  "reachable": "risky",
  "disposable": false,
  "roleAccount": true,
  "mxValid": true,
  "connection": true,
  "inboxFull": false,
  "catchAll": false,
  "deliverable": true,
  "disabled": false,
  "syntaxValid": true
}
</Code></pre>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-col>
        </v-row>
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
      tab: null,
      meta,
      mdiForum,
      mdiBookOpenPageVariant,
    }
  },
}
</script>
