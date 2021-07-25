<template>
  <div>
    <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
      <h1 class="mb-4">Verify API</h1>

      <p>
        Verify email addresses before sending to improve delivery. A high bounce
        rate lowers your sender reputation and you risk getting blocked by email
        providers.
      </p>

      <Heading id="endpoint" size="2" class="mt-8 mb-4">Endpoint</Heading>

      <p><code>GET</code> <code>https://api.wappalyzer.com/verify/v2/</code></p>

      <Heading id="properties" size="2" class="mt-8 mb-4">Properties</Heading>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th width="30%">Property</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Execution</td>
              <td>Synchronous</td>
            </tr>
            <tr>
              <td>Request timeout</td>
              <td>30s</td>
            </tr>
            <tr>
              <td>Rate limit</td>
              <td>5 requests / second</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="parameters" size="2" class="mt-8 mb-4">Parameters</Heading>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th width="30%">Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>email</code>&nbsp;<em class="text--disabled"
                  >(required)</em
                >
              </td>
              <td>
                Email address (e.g.
                <code>info@example.com</code>).
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="fields" size="2" class="mt-8 mb-4">Fields</Heading>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th width="30%">Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>email</code>
              </td>
              <td>
                The input email address, e.g. <code>info@example.com</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>domain</code>
              </td>
              <td>
                The domain portion of the email address, e.g.
                <code>example.com</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>reachable</code>
              </td>
              <td>
                One of <code>safe</code>, <code>risky</code>,
                <code>invalid</code> or <code>unknown</code>.
              </td>
            </tr>
            <tr>
              <td>
                <code>disposable</code>
              </td>
              <td>
                The email address is provided by a known disposable email
                provider.
              </td>
            </tr>
            <tr>
              <td>
                <code>roleAccount</code>
              </td>
              <td>
                Role accounts like <code>admin@example.com</code> and
                <code>accounting@example.com</code> are typically associated
                with a team or company rather than a person.
              </td>
            </tr>
            <tr>
              <td>
                <code>mxValid</code>
              </td>
              <td>The domain has valid MX DNS records.</td>
            </tr>
            <tr>
              <td>
                <code>connection</code>
              </td>
              <td>The SMTP server accepts connections.</td>
            </tr>
            <tr>
              <td>
                <code>inboxFull</code>
              </td>
              <td>The recipient's inbox is full.</td>
            </tr>
            <tr>
              <td>
                <code>catchAll</code>
              </td>
              <td>The email address is a catch-all address.</td>
            </tr>
            <tr>
              <td>
                <code>deliverable</code>
              </td>
              <td>Emails to this address are deliverable.</td>
            </tr>
            <tr>
              <td>
                <code>disabled</code>
              </td>
              <td>The recipient's inbox is disabled.</td>
            </tr>
            <tr>
              <td>
                <code>syntaxValid</code>
              </td>
              <td>The email address is syntactically valid.</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="examples" size="2" class="mt-8 mb-4">Examples</Heading>

      <v-card class="mb-8">
        <v-card-title class="subtitle-2">Example request</v-card-title>
        <v-card-text>
          <pre><Code>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/verify/v2/?email=info@example.com"</Code></pre>
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">
          Example response (success)
        </v-card-title>
        <v-card-text>
          <pre><Code>{
  "email": "info@example.com",
  "domain": "example.com",
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
      title: 'Verify API',
      side,
      crumbs: [
        { title: 'Developer documentation', to: '/docs/' },
        { title: 'APIs', to: '/docs/api/' },
      ],
      mdiLightbulbOnOutline,
    }
  },
}
</script>

<style>
td {
  padding-top: 0.2rem !important;
  padding-bottom: 0.2rem !important;
}
</style>
