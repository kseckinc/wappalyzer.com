<template>
  <div>
    <Page :title="title" :side="side" no-head>
      <h1 class="mb-4">
        Lookup API
      </h1>

      <p>
        Perform near-instant technology lookups with the Lookup API. Results are
        fetched from our comprehensive database of millions of websites. If we
        haven't seen a domain before, we'll index it immediately and report back
        within minutes.
      </p>

      <p>
        Results are site-wide and may even include pages behind logins that
        typical crawlers can't reach. Where available, country, language and
        traffic data are included.
      </p>

      <Heading id="endpoint" size="2" class="mt-8 mb-4">
        Endpoint
      </Heading>

      <p><code>GET</code> <code>https://api.wappalyzer.com/lookup/v2/</code></p>

      <Heading id="properties" size="2" class="mt-8 mb-4">
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
                Synchronous / Asynchronous (when response yields no results)
              </td>
            </tr>
            <tr>
              <td>Request timeout</td>
              <td>30s</td>
            </tr>
            <tr>
              <td>Rate limit</td>
              <td>1 request / second</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="parameters" size="2" class="mt-8 mb-4">
        Parameters
      </Heading>

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
              <td><code>urls</code></td>
              <td>Yes</td>
              <td>Between 1 and 10 website URLs, comma-separated.</td>
              <td>
                <code>https://example.com,https://example.com</code>
              </td>
            </tr>
            <tr>
              <td><code>callback_url</code></td>
              <td>No</td>
              <td>
                If instant results are unavailable, A POST request will be made
                to the callback URL upon completion of the request.
              </td>
              <td>
                <code>https://example.com</code>
              </td>
            </tr>
            <tr>
              <td><code>denoise</code></td>
              <td>No</td>
              <td>
                Exclude low confidence results (<code>true</code> (default) or
                <code>false</code>).
              </td>
              <td><code>false</code></td>
            </tr>
            <tr>
              <td><code>max_age</code></td>
              <td>No</td>
              <td>
                Return results of up to <code>max_age</code> months old
                (<code>1</code>-<code>12</code>). Set to <code>1</code> to only
                return fresh results. Defaults to <code>2</code>.
              </td>
              <td>
                <code>2</code>
              </td>
            </tr>
            <tr>
              <td><code>squash</code></td>
              <td>No</td>
              <td>
                Combine monthly results into a single set (default). Set to
                <code>false</code> to group results by month.
              </td>
              <td><code>true</code></td>
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

      <Heading id="examples" size="2" class="mt-8 mb-4">
        Examples
      </Heading>

      <p>
        <strong>Example request</strong>
      </p>

      <pre
        class="mb-4"
      ><Prism language="bash" class="body-2">curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/lookup/v2/?urls=https://example.com&amp;callback_url=https://example.com,https://example.org"</Prism></pre>

      <p><strong>Example response</strong></p>

      <p>
        TODO
      </p>

      <pre class="mb-4"><Prism language="json" class="body-2">[
  {
    "url": "https://example.com",
    "technologies": [
      {
        "slug": "craft-cms",
        "name": "Craft CMS",
        "categories": [
          {
            "id": 1,
            "slug": "cms",
            "name": "CMS"
        ],
        "versions": [],
        "hits": 0
      }
    ]
  },
  {
    "url": "https://example.org",
    "technologies": [],
    "crawl": true
  }
]
</Prism></pre>

      <p>
        The <code>hits</code> value is the number of times users of the
        <nuxt-link to="/download">browser extension</nuxt-link>
        have visited the website that month. It can be used as an indicator of
        traffic.
      </p>

      <p><strong>Example response (<code>202</code>)</strong></p>

      <p>
        If instant results are unavailable and <code>callback_url</code> is
        specified, a <code>202</code> is returned and the domain will be indexed
        using the <nuxt-link to="/docs/api/v2/crawl">Crawl API</nuxt-link> as a
        fallback. The callback URL will be called upon completion of the
        request, typically minutes later.
      </p>

      <pre class="mb-4"><Prism language="json" class="body-2">{
  "status": "received"
}</Prism></pre>

      <p>
        <strong>Example request (<code>squash=false</code>)</strong>
      </p>

      <pre
        class="mb-4"
      ><Prism language="bash" class="body-2">curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/lookup/v2/?urls=https://example.com&amp;callback_url=https://example.com,https://example.org"</Prism></pre>

      <p><strong>Example response (<code>200</code>)</strong></p>

      <p>
        Results are grouped by month and may contain data from anywhere between
        six months ago and today.
      </p>

      <pre class="mb-4"><Prism language="json" class="body-2">[
  {
    "url": "https://example.com",
    "results": [
      {
        "monthYear": "01-2020",
        "technologies": [
          {
            "slug": "craft-cms",
            "name": "Craft CMS",
            "categories": [
              {
                "id": 1,
                "slug": "cms",
                "name": "CMS"
            ],
            "versions": [],
            "hits": 0
          }
        ]
      }
    ]
  },
  {
    "url": "https://example.org",
    "results": [],
    "crawl": true
  }
]</Prism></pre>

      <p>
        The <code>hits</code> value is the number of times users of the
        <nuxt-link to="/download">browser extension</nuxt-link>
        have visited the website that month. It can be used as an indicator of
        traffic.
      </p>

      <p><strong>Example response (<code>202</code>)</strong></p>

      <p>
        If instant results are unavailable and <code>callback_url</code> is
        specified, a <code>202</code> is returned and the domain will be indexed
        using the <nuxt-link to="/docs/api/v2/crawl">Crawl API</nuxt-link> as a
        fallback. The callback URL will be called upon completion of the
        request, typically minutes later.
      </p>

      <pre class="mb-4"><Prism language="json" class="body-2">{
  "status": "received"
}</Prism></pre>

      <p>
        If no callback URL is specified, a <code>404</code> response code will
        be returned instead.
      </p>

      <v-alert icon="mdi-lightbulb-on-outline" outlined>
        A <code>404</code> response will still be counted towards the
        subscription quota. Provide a <code>callback_url</code> if possible.
      </v-alert>

      <p><strong>Example callback response</strong></p>

      <p>
        The callback URL will receive a POST request when results become
        available.
      </p>

      <pre class="mb-4"><Prism language="json" class="body-2">{
  "url": "https://example.com",
  "technologies": [
    {
      "slug": "craft-cms",
      "name": "Craft CMS",
      "confidence": "100",
      "version": "",
      "icon": "CraftCMS.svg",
      "website": "https://craftcms.com",
      "categories": [
        {
          "id": 1,
          "slug": "cms",
          "name": "CMS"
        }
      ]
    }
  ]
}</Prism></pre>
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
    Heading
  },
  data() {
    return {
      title: 'Developer documentation',
      side
    }
  }
}
</script>
