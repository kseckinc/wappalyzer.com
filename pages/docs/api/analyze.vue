<template>
  <div>
    <Page :title="title" :side="side" no-head>
      <h1 class="mb-4">
        Analyze API
      </h1>

      <p>
        Identify the technologies used on any public URL in real-time. Results
        are always guaranteed up-to-date and delivered within seconds.
      </p>

      <h2 id="endpoint" class="mt-8 mb-2">
        Endpoint
        <a href="#endpoint" class="docs__anchor"
          ><v-icon color="accent">mdi-link</v-icon></a
        >
      </h2>

      <p>
        <code>GET</code> <code>https://api.wappalyzer.com/analyze/v1/</code>
      </p>

      <h2 id="properties" class="mt-8 mb-2">
        Properties
        <a href="#properties" class="docs__anchor"
          ><v-icon color="accent">mdi-link</v-icon></a
        >
      </h2>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Property</th>
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
              <td>
                1 request / second
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <h2 id="parameters" class="mt-8 mb-2">
        Parameters
        <a href="#parameters" class="docs__anchor"
          ><v-icon color="accent">mdi-link</v-icon></a
        >
      </h2>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Required</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>url</code></td>
              <td>Yes</td>
              <td>URL of the web page to analyse</td>
              <td><code>https://example.com</code></td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <h2 id="examples" class="mt-8 mb-2">
        Examples
        <a href="#examples" class="docs__anchor"
          ><v-icon color="accent">mdi-link</v-icon></a
        >
      </h2>

      <p><strong>Example request</strong></p>

      <pre
        class="mb-4"
      ><Prism language="bash" class="body-2">curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/analyze/v1/?url=https://example.com"</Prism></pre>

      <p><strong>Example response (success)</strong></p>

      <pre class="mb-4"><Prism language="json" class="body-2">{
  "status": "success",
  "applications": [
    {
      "name": "Craft CMS",
      "confidence": "100",
      "version": "",
      "icon": "CraftCMS.svg",
      "website": "https://craftcms.com",
      "categories": {
        "1": "CMS"
      }
    }
  ]
]</Prism></pre>

      <p><strong>Example response (error)</strong></p>

      <p>
        An
        <nuxt-link to="/docs/api/basics#error-types">error type</nuxt-link> and
        message is returned if the URL could not be fetched.
      </p>

      <pre class="mb-4"><Prism language="json" class="body-2">{
  "status": "error",
  "errors": [
    {
      "type": "RESPONSE_NOT_OK",
      "message": "Response was not ok"
    }
  ],
  "applications": []
}</Prism></pre>

      <v-alert icon="mdi-lightbulb-on-outline" outlined>
        Unsuccesful responses count towards the subscription quota.
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
