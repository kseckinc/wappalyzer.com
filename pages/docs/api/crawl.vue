<template>
  <div>
    <Page :title="title" :side="side" no-head>
      <h1 class="mb-4">
        Crawl API
      </h1>

      <p>
        Identify the technologies used on any public website in real-time.
        Results are always guaranteed up-to-date and delivered within minutes.
      </p>

      <p>
        This API is asynchronous: results are sent to a callback URL after the
        domain has been indexed.
      </p>

      <h2 id="endpoint" class="mt-8 mb-2">
        Endpoint
        <a href="#endpoint" class="docs__anchor"
          ><v-icon color="accent">mdi-link</v-icon></a
        >
      </h2>

      <p><code>GET</code> <code>https://api.wappalyzer.com/crawl/v1/</code></p>

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
        <a href="#examples" class="docs__anchor"
          ><v-icon color="accent">mdi-link</v-icon></a
        >
      </h2>

      <p><strong>Example request</strong></p>

      <pre
        class="mb-4"
      ><Prism language="bash" class="body-2">curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/crawl/v1/?url=https://example.com&amp;callback_url=https://example.com"</Prism></pre>

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
