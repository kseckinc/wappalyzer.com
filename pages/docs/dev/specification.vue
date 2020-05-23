<template>
  <div>
    <Page :title="title" :side="side" no-head>
      <h1 id="specification" class="mb-4">
        Specification
        <a href="#specification">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h1>

      <p>
        A long list of
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
          target="_blank"
          >regular expressions</a
        >
        is used to identify technologies on web pages. Wappalyzer inspects HTML
        code, as well as JavaScript variables, response headers and more.
      </p>

      <p>
        Patterns (regular expressions) are kept in
        <a
          href="https://github.com/aliasio/wappalyzer/blob/master/src/apps.json"
          target="_blank"
        >
          <code>src/apps.json</code> </a
        >. The following is an example of an application fingerprint.
      </p>

      <h4>Example</h4>

      <pre class="mb-4"><Prism language="json" class="body-2">"Example": {
  "cats": [
    "1"
  ],
  "cookies": {
    "cookie_name": "Example"
  },
  "js": {
    "Example.method": ""
  },
  "excludes": "Example",
  "headers": {
  "X-Powered-By": "Example"
  },
  "html": "&lt;link[^&gt;]example\\.css",
  "implies": "PHP\\;confidence:50",
  "meta": {
  "generator": "(?:Example|Another Example)"
  },
  "script": "example-([0-9.]+)\\.js\\;confidence:50\\;version:\\1",
  "url": ".+\\.example\\.com",
  "website": "https://example.com",
}</Prism></pre>

      <h2 id="json-fields" class="mt-8 mb-2">
        JSON fields
        <a href="#json-fields">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

      <p>
        Find the JSON schema at

        <a
          href="https://github.com/aliasio/wappalyzer/blob/master/schema.json"
          target="_blank"
        >
          <code>schema.json</code> </a
        >.
      </p>

      <h3 id="properties-required" class="mt-8 mb-2">
        Properties (required)
        <a href="#properties-required">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h3>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>cats</code></td>
              <td>Array</td>
              <td>
                One or more category IDs.<!-- Refer to the
                <a
                  href="https://www.wappalyzer.com/categories/list"
                  target="_blank"
                 g
                  >list of category IDs</a
                  >. -->
              </td>
              <td><code>[1, 6]</code></td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td>String</td>
              <td>Application icon filename.</td>
              <td><code>"WordPress.svg"</code></td>
            </tr>
            <tr>
              <td><code>website</code></td>
              <td>String</td>
              <td>URL of the application's website.</td>
              <td>
                <code>"https://example.com"</code>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <h3 id="properties-required" class="mt-8 mb-2">
        Optional properties
        <a href="#optional-properties">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h3>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>cpe</code></td>
              <td>String</td>
              <td>The <a href="https://cpe.mitre.org/about/">CPE</a> is a structured naming scheme for applications, see the <a href="https://cpe.mitre.org/specification/">specification</a>.</td>
              <td><code>"cpe:/a:apache:http_server"</code></td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>


      <h3 id="implies-and-excludes-optional" class="mt-8 mb-2">
        Implies and excludes (optional)
        <a href="#implies-and-excludes-optional">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h3>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>implies</code></td>
              <td>String | Array</td>
              <td>
                The presence of one application can imply the presence of
                another, e.g. WordpPress means PHP is also in use.
              </td>
              <td><code>"PHP"</code></td>
            </tr>
            <tr>
              <td><code>excludes</code></td>
              <td>String | Array</td>
              <td>
                Opposite of implies. The presence of one application can 
                exclude the presence of another.
              </td>
              <td><code>"Apache"</code></td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <h3 id="patterns-optional" class="mt-8 mb-2">
        Patterns (optional)
        <a href="#patterns-optional">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h3>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>cookies</code></td>
              <td>Object</td>
              <td>Cookies.</td>
              <td><code>{ "cookie_name": "Cookie value" }</code></td>
            </tr>
            <tr>
              <td><code>js</code></td>
              <td>Object</td>
              <td>
                JavaScript methods (case sensitive). Avoid short patterns to
                prevent matching minified code.
              </td>
              <td><code>{ "jQuery.fn.jquery": "" }</code></td>
            </tr>
            <tr>
              <td><code>headers</code></td>
              <td>Object</td>
              <td>HTTP response headers.</td>
              <td><code>{ "X-Powered-By": "^WordPress$" }</code></td>
            </tr>
            <tr>
              <td><code>html</code></td>
              <td>String | Array</td>
              <td>
                HTML source code. Patterns must include an HTML opening tag to
                avoid matching plain text.
              </td>
              <td><code>"&lt;a [^&gt;]*href=\"index.html"</code></td>
            </tr>
            <tr>
              <td><code>url</code></td>
              <td>String</td>
              <td>Full URL of the page.</td>
              <td><code>"^https?//.+\\.wordpress\\.com"</code></td>
            </tr>
            <tr>
              <td><code>meta</code></td>
              <td>Object</td>
              <td>HTML meta tags, e.g. generator.</td>
              <td><code>{ "generator": "^WordPress$" }</code></td>
            </tr>
            <tr>
              <td><code>script</code></td>
              <td>String | Array</td>
              <td>
                URLs of JavaScript files included on the page.
              </td>
              <td><code>"jquery\\.js"</code></td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <h3 id="patterns" class="mt-8 mb-2">
        Patterns
        <a href="#patterns">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h3>

      <p>
        Patterns are essentially JavaScript regular expressions written as
        strings, but with some additions.
      </p>

      <h2 id="quirks-and-pitfalls" class="mt-8 mb-2">
        Quirks and pitfalls
        <a href="#quirks-and-pitfalls">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

      <ul class="mb-4">
        <li>
          Because of the string format, the escape character itself must be
          escaped when using special characters such as the dot
          (<code>\\.</code>). Double quotes must be escaped only once
          (<code>\"</code>). Slashes do not need to be escaped (<code>/</code>).
        </li>
        <li>
          Flags are not supported. Regular expressions are treated as
          case-insensitive.
        </li>
        <li>
          Capture groups (<code>()</code>) are used for version detection. In
          other cases, use non-capturing groups (<code>(?:)</code>).
        </li>
        <li>
          Use start and end of string anchors (<code>^</code> and
          <code>$</code>) where possible for optimal performance.
        </li>
        <li>
          Short or generic patterns can cause applications to be identified
          incorrectly. Try to find unique strings to match.
        </li>
      </ul>

      <h2 id="tags" class="mt-8 mb-2">
        Tags
        <a href="#tags">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

      <p>
        Tags (a non-standard syntax) can be appended to patterns (and implies
        and excludes, separated by <code>\\;</code>) to store additional
        information.
      </p>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>confidence</code></td>
              <td>
                Indicates a less reliable pattern that may cause false
                positives. The aim is to achieve a combined confidence of 100%.
                Defaults to 100% if not specified.
              </td>
              <td>
                <code>"js": { "Mage": "\\;confidence:50" }</code>
              </td>
            </tr>
            <tr>
              <td><code>version</code></td>
              <td>
                Gets the version number from a pattern match using a special
                syntax.
              </td>
              <td>
                <code>"script": "jquery-([0-9.]+)\.js\\;version:\\1"</code>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <h2 id="version-syntax" class="mt-8 mb-2">
        Version syntax
        <a href="#version-syntax">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

      <p>
        Application version information can be obtained from a pattern using a
        capture group. A condition can be evaluated using the ternary operator
        (<code>?:</code>).
      </p>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th>Example</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>\\1</code></td>
              <td>Returns the first match.</td>
            </tr>
            <tr>
              <td><code>\\1?a:</code></td>
              <td>
                Returns a if the first match contains a value, nothing
                otherwise.
              </td>
            </tr>
            <tr>
              <td><code>\\1?a:b</code></td>
              <td>
                Returns a if the first match contains a value, b otherwise.
              </td>
            </tr>
            <tr>
              <td><code>\\1?:b</code></td>
              <td>
                Returns nothing if the first match contains a value, b
                otherwise.
              </td>
            </tr>
            <tr>
              <td><code>foo\\1</code></td>
              <td>
                Returns foo with the first match appended.
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
