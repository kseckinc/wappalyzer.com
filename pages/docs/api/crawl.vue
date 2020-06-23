<template>
  <div>
    <Page :title="title" :side="side" no-head>
      <h1 id="crawl-api" class="mb-4">
        Crawl API
        <a href="#crawl-api"><v-icon color="accent">mdi-link</v-icon></a>
      </h1>

      <p>
        Fetch and analyse a domain. The crawler fetches up to 25 pages in
        real-time and returns the combined results.
      </p>

      <p>
        This API is asynchronous: results are sent to a callback URL after the
        domain has been indexed.
      </p>

      <h2 id="endpoint" class="mt-8 mb-2">
        Endpoint
        <a href="#endpoint"><v-icon color="accent">mdi-link</v-icon></a>
      </h2>

      <p><code>GET</code> <code>https://api.wappalyzer.com/crawl/v1/</code></p>

      <h2 id="properties" class="mt-8 mb-2">
        Properties
        <a href="#properties"><v-icon color="accent">mdi-link</v-icon></a>
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
              <td>Asynchronous</td>
            </tr>
            <tr>
              <td>Request timeout</td>
              <td>6s</td>
            </tr>
            <tr>
              <td>Rate limit</td>
              <td>1 request / second</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <h2 id="parameters" class="mt-8 mb-2">
        Parameters
        <a href="#parameters"><v-icon color="accent">mdi-link</v-icon></a>
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
              <td>
                URL of the first web page to analyze
              </td>
              <td><code>https://example.com</code></td>
            </tr>
            <tr>
              <td><code>callback_url</code></td>
              <td>Yes</td>
              <td>
                A POST request will be made to the callback URL upon completion
                of the request
              </td>
              <td><code>https://example.com</code></td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <h2 id="examples" class="mt-8 mb-2">
        Examples
        <a href="#examples"><v-icon color="accent">mdi-link</v-icon></a>
      </h2>

      <p><strong>Example request</strong></p>

      <pre
        class="mb-4"
      ><Prism language="bash" class="body-2">curl -H "x-api-key: wappalyzer.api.demo.key" \
"https://api.wappalyzer.com/crawl/v1/?url=https://example.com&amp;callback_url=https://example.com"</Prism></pre>

      <p><strong>Example response (<code>202</code>)</strong></p>

      <pre class="mb-4"><Prism language="json" class="body-2">{
  "status": "received"
}</Prism></pre>

      <p><strong>Example callback response (success)</strong></p>

      <p>
        The callback URL will receive a POST request when results become
        available.
      </p>

      <pre class="mb-4"><Prism language="json" class="body-2">{
  "url": "https://example.com",
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
  ],
  "status": "success"
}</Prism></pre>

      <p><strong>Example callback response (error)</strong></p>

      <p>
        An
        <nuxt-link to="/docs/api/basics#error-types" class=""
          >error type</nuxt-link
        >
        and message is returned if no URLs could be fetched.
      </p>

      <pre class="mb-4"><Prism language="json" class="body-2">{
  "url": "https://example.com",
  "applications": [],
  "status": "error",
  "errors": [
    {
      "type": "RESPONSE_NOT_OK",
      "message": "Response was not ok"
    }
  ]
}</Prism></pre>
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
