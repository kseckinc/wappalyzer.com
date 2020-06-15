<template>
  <div>
    <Page :title="title" :side="side" no-head>
      <h1 class="mb-4">
        Development setup
      </h1>

      <p>
        First, ensure you have all of the following:
      </p>

      <ul class="mb-4">
        <li><a href="https://git-scm.com">Git</a></li>
        <li><a href="https://nodejs.org">Node.js</a> version 12 or higher</li>
        <li><a href="https://yarnpkg.com">Yarn</a></li>
      </ul>

      <p>
        Then,
        <a
          href="https://help.github.com/articles/fork-a-repo/"
          target="_blank"
          g
          >fork</a
        >
        the
        <a href="https://github.com/aliasio/wappalyzer" target="_blank"
          >repository on GitHub</a
        >
        and clone it. Enter the newly created directory, install dependencies
        with Yarn and run <code>yarn run link</code> to complete the setup.
      </p>

      <pre
        class="mb-4"
      ><Prism language="bash" class="body-2">$ git clone https://github.com/&lt;your_github_username&gt;/wappalyzer.git
$ cd wappalyzer
$ yarn install
$ yarn run link</Prism></pre>

      <h2 id="drivers" class="mt-8 mb-2">
        Drivers
        <a href="#drivers">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h2>

      <p>
        Wappalyzer is available on multiple platforms. Core functionality is
        contained within
        <a
          href="https://github.com/aliasio/wappalyzer/blob/master/src/wappalyzer.js"
          target="_blank"
          g
          ><code>src/wappalyzer.js</code></a
        >. Platform specific code is in
        <a
          href="https://github.com/aliasio/wappalyzer/tree/master/src/drivers"
          target="_blank"
          g
          ><code>src/drivers</code></a
        >.
      </p>

      <p>
        Follow the steps below to run Wappalyzer from source.
      </p>

      <h3 id="chrome" class="mt-8 mb-2">
        Chrome and Edge extensions
        <a href="#chrome">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h3>

      <ul>
        <li>Go go <code>about:extensions</code></li>
        <li>Enable 'Developer mode'</li>
        <li>Click 'Load unpacked'</li>
        <li>Select <code>src/drivers/webextension</code></li>
      </ul>

      <h3 id="firefox" class="mt-8 mb-2">
        Firefox add-on
        <a href="#firefox">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h3>

      <ul>
        <li>Go go <code>about:debugging#/runtime/this-firefox</code></li>
        <li>Click 'Load Temporary Add-on'</li>
        <li>Select <code>src/drivers/webextension/manifest.json</code></li>
      </ul>

      <h3 id="nodejs" class="mt-8 mb-2">
        Node.js
        <a href="#nodejs">
          <v-icon color="accent">mdi-link</v-icon>
        </a>
      </h3>

      <p>
        Run Wappalyzer directly on the command line using Node.js. For available
        options, other uses and examples, see the
        <nuxt-link to="/docs/dev/nodejs">documentation</nuxt-link>.
      </p>

      <pre
        class="mb-4"
      ><Prism language="bash" class="body-2">$ node src/drivers/npm/cli.js https://example.com</Prism></pre>
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
