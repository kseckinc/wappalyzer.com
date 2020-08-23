<template>
  <div>
    <Page :title="title" :side="side" no-hero no-head>
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

      <Heading id="pricing" size="2" class="mt-8 mb-2">
        Pricing
      </Heading>

      <p>
        API calls deduct credits from your balance. Credits are included in
        <nuxt-link to="/pricing">plans</nuxt-link> and can also be
        <nuxt-link :to="{ path: '/pricing', hash: 'credits' }"
          >purchased directly</nuxt-link
        >. To determine the number of credits spent per request, refer to the
        <nuxt-link :to="{ path: '/pricing', hash: 'usage' }">pricing</nuxt-link>
        page.
      </p>

      <Heading id="authentication" size="2" class="mt-8 mb-2">
        Authentication
      </Heading>

      <p>
        Wappalyzer uses API keys to provide authorized access to its APIs. Sign
        up to <nuxt-link to="/apikey">create an API key</nuxt-link>.
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
                Your API key
              </td>
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
              <td>
                The request was completed successfully
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

      <Heading id="credit-balance" size="2" class="mt-8 mb-2">
        Credit balance
      </Heading>

      <p>
        Every response includes a header with the credit spend and remaining
        balance.
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
              <td>
                The number of credits deducted
              </td>
            </tr>
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
import Heading from '~/components/Heading.vue'
import side from '~/assets/json/nav/docs.json'

export default {
  components: {
    Page,
    Heading,
  },
  data() {
    return {
      title: 'Developer documentation',
      side,
    }
  },
}
</script>
