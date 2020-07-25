<template>
  <div>
    <Page :title="title" :side="side" no-head>
      <h1 class="mb-4">
        Basics
      </h1>

      <p>
        The
        <nuxt-link to="/api">Wappalyzer APIs</nuxt-link>
        provide programmatic access to technographic data on websites, either in
        real-time or prefetched.
      </p>

      <ul class="mb-4">
        <li>
          The APIs conform to
          <a
            href="https://en.wikipedia.org/wiki/Representational_state_transfer"
            target="_blank"
            >REST</a
          >
          principles
        </li>
        <li>
          The
          <a href="https://en.wikipedia.org/wiki/JSON" target="_blank">JSON</a>
          data format is used for responses and POST requests
        </li>
        <li>All resources require authentication</li>
        <li>Requests are rate-limited and metered</li>
        <li>Endpoints are HTTPS only</li>
      </ul>

      <h2 id="pricing" class="mt-8 mb-2">
        Pricing
        <a href="#pricing" class="docs__anchor">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

      <p>
        API calls deduct credits from your balance. Credits are included in
        <nuxt-link to="/pricing">plans</nuxt-link> and can also be
        <nuxt-link :to="{ path: '/pricing', hash: 'credits' }"
          >purchased directly</nuxt-link
        >. To determine the number of credits spent per request, refer to the
        <nuxt-link :to="{ path: '/pricing', hash: 'usage' }">pricing</nuxt-link>
        page.
      </p>

      <h2 id="authentication" class="mt-8 mb-2">
        Authentication
        <a href="#authentication" class="docs__anchor">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

      <p>
        Wappalyzer uses API keys to provide authorized access to its APIs.
        <nuxt-link to="/api">Subscribe</nuxt-link>
        to a plan to obtain an API key.
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
              <td>
                <em><code>&lt;your api key&gt;</code></em>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <h2 id="response-codes" class="mt-8 mb-2">
        Response codes
        <a href="#response-codes" class="docs__anchor">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

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
              <td>
                The request was completed successfully
              </td>
            </tr>
            <tr>
              <td><code>202</code></td>
              <td>
                The request has been accepted for processing
              </td>
            </tr>
            <tr>
              <td><code>400</code></td>
              <td>
                There was an error with the request
              </td>
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

      <v-alert icon="mdi-lightbulb-on-outline" outlined>
        In less common scenarios, other status codes may be used. To verify if a
        request was successful, check for a <code>2xx</code> code. A
        <code>4xx</code> code indicates a problem with the request. A
        <code>5xx</code> code means a server-side error occurred.
      </v-alert>

      <h2 id="error-types" class="mt-8 mb-2">
        Error types
        <a href="#error-types" class="docs__anchor">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

      <p>
        In case of an error, an error type may be included in the JSON response,
        along with a message detailing the error.
      </p>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GENERIC</code></td>
              <td>A generic or unkown error occured</td>
            </tr>
            <tr>
              <td><code>RESPONSE_NOT_OK</code></td>
              <td>
                The server did not respond with a <code>200</code> HTTP code
              </td>
            </tr>
            <tr>
              <td><code>NO_RESPONSE</code></td>
              <td>
                The server did not respond in time
              </td>
            </tr>
            <tr>
              <td><code>NO_HTML_DOCUMENT</code></td>
              <td>
                The server response did not include a HTML document
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <h2 id="credit-balance" class="mt-8 mb-2">
        Credit balance
        <a href="#credit-balance" class="docs__anchor">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

      <p>
        Every response includes a header with your credit balance.
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
                <code>wappalyzer-credits-remaining</code>
              </td>
              <td>
                Your credit balance
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>
    </Page>
  </div>
</template>

<script>
import Page from '~/components/Page.vue'
import side from '~/assets/json/nav/docs.json'

export default {
  components: {
    Page
  },
  data() {
    return {
      title: 'Developer documentation',
      side
    }
  }
}
</script>

<style>
h2 .docs__anchor,
h3 .docs__anchor {
  visibility: hidden;
}

h2:hover .docs__anchor,
h3:hover .docs__anchor {
  visibility: visible;
}

.docs__anchor {
  text-decoration: none;
}
</style>
