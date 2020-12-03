<template>
  <div>
    <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
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

      <Heading id="endpoint" size="2" class="mt-8 mb-2">
        Endpoint
      </Heading>

      <p><code>GET</code> <code>https://api.wappalyzer.com/crawl/v2/</code></p>

      <Heading id="properties" size="2" class="mt-8 mb-2">
        Properties
      </Heading>

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
              <td>
                Synchronous / Asynchronous (when crawling or indexing multiple
                domains)
              </td>
            </tr>
            <tr>
              <td>Request timeout</td>
              <td>30s</td>
            </tr>
            <tr>
              <td>Rate limit</td>
              <td>1 request / second (up to ten domains per request)</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="parameters" size="2" class="mt-8 mb-2">
        Parameters
      </Heading>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>urls</code>&nbsp;<em class="text--disabled"
                  >(required)</em
                >
              </td>
              <td>
                Beetween one and ten website URLs (e.g.
                <code>https://example.com,https://example.org</code>).
              </td>
            </tr>
            <tr>
              <td><code>callback_url</code></td>
              <td>
                A POST request will be made to the callback URL upon completion
                of the request (e.g.
                <code>https://yourdomain.com</code>). Required when
                <code>recursive</code> is <code>true</code> (default) or
                multiple <code>urls</code> are specified.
              </td>
            </tr>
            <tr>
              <td><code>recursive</code></td>
              <td>
                Follow links to analyse up to 25 pages (<code>true</code>
                (default) or <code>false</code>).
              </td>
            </tr>
            <tr>
              <td><code>sets</code></td>
              <td>
                Comma-separated list of additional attribute sets to include in
                the results (e.g. <code>meta,social</code>). See
                <nuxt-link to="/docs/sets/">Attribute sets</nuxt-link>.
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="callback" size="2" class="mt-8 mb-4">
        Callback
      </Heading>

      <p>
        A callback URL is a public endpoint hosted on your own server. If you
        request a domain that we haven't seen before, you'll initially get an
        empty response while the website is being indexed. Minutes later, your
        callback URL will receive a POST request with the final results. Without
        a callback URL, you will not get these results unless you make another
        request.
      </p>

      <Heading id="examples" size="2" class="mt-8 mb-2">
        Examples
      </Heading>

      <v-card class="mb-8">
        <v-card-title class="subtitle-2">Example request</v-card-title>
        <v-card-text>
          <p>
            By default, websites are crawled recursively by following links on
            the page and a callback URL is required.
          </p>

          <pre><Prism language="bash" class="body-2">curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/crawl/v2/?urls=https://example.com,https://example.org&amp;callback_url=https://yourdomain.com"</Prism></pre>
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">Example response</v-card-title>
        <v-card-text>
          <p>
            The callback URL will receive a POST request when results become
            available. The callback URL will be invoked seperately for each
            requested URL.
          </p>
          <pre><Prism language="json" class="body-2">[
  {
    "url": "https://example.com",
    "crawl": true // Crawl initiated
  },
  {
    "url": "https://example.org",
    "crawl": true // Crawl initiated
  }
]</Prism></pre>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title class="subtitle-2">Example request</v-card-title>
        <v-card-text>
          <p>
            In this example we pass a single URL, set <code>recursive</code> to
            <code>false</code> and no <code>callback_url</code>. This way only a
            single page is indexed and results are available directly in the
            response. This method is faster and requires less effort to set up
            but results are less comprehensive.
          </p>

          <pre><Prism language="bash" class="body-2">curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/crawl/v2/?urls=https://example.com&amp;recursive=false"</Prism></pre>
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2"
          >Example response (success)</v-card-title
        >
        <v-card-text>
          <pre><Prism language="json" class="body-2">[
  {
    "url": "https://example.com",
    "technologies": [
      {
        "slug": "craft-cms",
        "name": "Craft CMS",
        "versions": [
          "3.0.0"
        ],
        "categories": [
          {
            "id": 1,
            "slug": "cms",
            "name": "CMS"
          }
        ]
      }
    ]
  }
]</Prism></pre>
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">Example response (error)</v-card-title>
        <v-card-text>
          <pre><Prism language="json" class="body-2">[
  {
    "url": "https://example.com",
    "errors": [
      "No response from server"
    ]
  }
]</Prism></pre>
        </v-card-text>
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
      title: 'Crawl API',
      side,
      crumbs: [
        { title: 'Developer documentation', to: '/docs/' },
        { title: 'APIs', to: '/docs/api/' },
      ],
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
