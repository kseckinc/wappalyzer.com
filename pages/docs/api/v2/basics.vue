<template>
  <div>
    <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
      <h1 class="mb-4">Basics</h1>

      <p>
        Our APIs provide programmatic access to our comprehensive database of
        websites and companies, as well live analysis of websites and email
        addresses.
      </p>

      <p>The APIs&hellip;</p>

      <ul class="mb-4">
        <li>
          Conform to
          <a
            href="https://en.wikipedia.org/wiki/Representational_state_transfer"
            target="_blank"
            >REST</a
          >
          principles
        </li>
        <li>
          Return
          <a href="https://en.wikipedia.org/wiki/JSON" target="_blank">JSON</a>
          data
        </li>
        <li>Require authentication</li>
        <li>Are metered and rate-limited</li>
        <li>Are HTTPS only</li>
      </ul>

      <Heading id="pricing" size="2" class="mt-8 mb-2"> Pricing </Heading>

      <p>
        API calls cost credits. Credits are included in
        <nuxt-link to="/pricing/">plans</nuxt-link> and can also be
        <nuxt-link :to="{ path: '/pricing/', hash: 'credits' }"
          >purchased separately</nuxt-link
        >.
      </p>

      <p>
        Sign up for an account to trial the APIs for free. The Free plan
        includes 50 credits that can be spent on any product.
      </p>

      <Heading id="authentication" size="2" class="mt-8 mb-2">
        Authentication
      </Heading>

      <p>
        API keys are used for authorized access. Sign up to
        <nuxt-link to="/apikey/">create an API key</nuxt-link>.
      </p>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Request header</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>x-api-key</code></td>
              <td>Your API key</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="signatures" size="2" class="mt-8 mb-2">
        Callback signatures
      </Heading>

      <p>
        Requests to your callback endpoint can optionally be signed to allow you
        to verify the request was made by us. To enable signing,
        <nuxt-link to="/apikey/">create a signing secret</nuxt-link>.
      </p>

      <p>
        To verify a request, create a SHA256 hash of the signing secret appended
        with the raw JSON request body. The request is valid if the hash matches
        the hash in the
        <code>wappalyzer-signature</code> header in the request.
      </p>

      <v-card class="my-8">
        <v-card-text>
          <pre><Code>sha256(secret + body) == signature</Code></pre>
        </v-card-text>
      </v-card>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Request header</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>wappalyzer-signature</code></td>
              <td>SHA256 hash</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="response-codes" size="2" class="mt-8 mb-2">
        Response codes
      </Heading>

      <p>
        The APIs return
        <a
          href="https://en.wikipedia.org/wiki/List_of_HTTP_status_codes"
          target="_blank"
          >HTTP status codes</a
        >
        in addition to JSON-based responses.
      </p>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>HTTP code</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>200</code></td>
              <td>The request was completed successfully</td>
            </tr>
            <tr>
              <td><code>400</code></td>
              <td>There was an error with the request</td>
            </tr>
            <tr>
              <td><code>403</code></td>
              <td>
                Authorisation failure (incorrect API key, invalid method or
                resource or insufficient credits)
              </td>
            </tr>
            <tr>
              <td><code>429</code></td>
              <td>Rate limit exceeded</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <v-alert :icon="mdiLightbulbOnOutline" type="info" class="my-8" text>
        In less common scenarios, other status codes may be used. To verify if a
        request was successful, check for a <code>2xx</code> code. A
        <code>4xx</code> code indicates a problem with the request. A
        <code>5xx</code> code means a server-side error occurred.
      </v-alert>

      <Heading id="credit-balance" size="2" class="mt-8 mb-2">
        Credit balance
      </Heading>

      <p>
        Every successful response includes headers with the numbers of credits
        that were spent and your remaining balance.
      </p>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Header</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>wappalyzer-credits-spent</code>
              </td>
              <td>The number of credits deducted</td>
            </tr>
            <tr>
              <td>
                <code>wappalyzer-credits-remaining</code>
              </td>
              <td>Your credit balance</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <p class="mt-8">
        Alternatively, you can get your remaining credit balance by calling a
        separate endpoint:
      </p>

      <Heading id="endpoint" size="3" class="mt-8 mb-4"> Endpoint </Heading>

      <p>
        <code>GET</code>
        <code>https://api.wappalyzer.com/v2/credits/balance/</code>
      </p>

      <Heading id="examples" size="3" class="mt-8 mb-4">Example</Heading>

      <h4 class="mb-2">Request</h4>

      <pre><Code>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/credits/balance/"</Code></pre>

      <h4 class="mt-8 mb-2">Response</h4>

      <pre><Code>{
  "credits": 100000
}</Code></pre>
    </Page>
  </div>
</template>

<script>
import { mdiLightbulbOnOutline } from '@mdi/js'

import Page from '~/components/Page.vue'
import Heading from '~/components/Heading.vue'
import Code from '~/components/Code.vue'
import side from '~/assets/json/nav/docs.json'

export default {
  components: {
    Page,
    Heading,
    Code,
  },
  data() {
    return {
      title: 'Basics',
      mdiLightbulbOnOutline,
      side,
      crumbs: [
        { title: 'Developer documentation', to: '/docs/' },
        { title: 'APIs', to: '/docs/api/' },
      ],
    }
  },
}
</script>
