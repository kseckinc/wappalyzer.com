<template>
  <div>
    <Page :title="title" :side="side" no-head>
      <h1 id="basics" class="mb-4">
        Basics
        <a href="#basics">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
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
        <li>Requests are rate-limited and capped to a monthly quota</li>
        <li>Endpoints are HTTPS only</li>
      </ul>

      <h2 id="authentication" class="mt-8 mb-2">
        Authentication
        <a href="#authentication">
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
                <em><code>&lt;Your API key&gt;</code></em>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <h2 id="demo-api-key" class="mt-8 mb-2">
        Demo API key
        <a href="#demo-api-key">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

      <p>
        Use the API key below to try the APIs before purchasing a subscription.
        It's good for ten requests per day across all APIs.
      </p>

      <p><code>wappalyzer.api.demo.key</code></p>

      <h2 id="response-codes" class="mt-8 mb-2">
        Response codes
        <a href="#response-codes">
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
                Authorisation failure (incorrect API key or invalid method or
                resource)
              </td>
            </tr>
            <tr>
              <td><code>429</code></td>
              <td>Usage plan quota exceeded</td>
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
        <a href="#error-types">
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

      <h2 id="limits-usage" class="mt-8 mb-2">
        Limits &amp; usage
        <a href="#limits-usage">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

      <p>
        Every request includes response headers detailing the API limits and
        your usage.
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
                <code>wappalyzer-rate-limit</code>
              </td>
              <td>
                The maximum number of request that can be made per second
              </td>
            </tr>
            <tr>
              <td>
                <code>wappalyzer-quota-limit</code>
              </td>
              <td>
                The total number of requests that can be made within the time
                period
              </td>
            </tr>
            <tr>
              <td>
                <code>wappalyzer-quota-period</code>
              </td>
              <td>
                The period of time after which the quota is reset (e.g.
                <code>MONTH</code>)
              </td>
            </tr>
            <tr>
              <td>
                <code>wappalyzer-quota-remaining</code>
              </td>
              <td>
                The remaining number of requests that can be made within the
                time period
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <v-alert icon="mdi-lightbulb-on-outline" outlined>
        The remaining quota value is updated periodically and should be treated
        as an estimate
      </v-alert>
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
