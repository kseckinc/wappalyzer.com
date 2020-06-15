<template>
  <div>
    <Page :title="title" :side="side" no-head>
      <h1 class="mb-4">
        Node.js module
      </h1>

      <p>
        Wappalyzer's software is free and open-source, permitting both personal
        and commercial use, allowing you to build your own custom solution to
        identify technologies on websites. The software is actively maintained
        and contributed to by a large community of developers.
      </p>

      <v-alert icon="mdi-lightbulb-on-outline" class="my-8" outlined>
        Consider using our <nuxt-link to="/api">APIs</nuxt-link> if you don't
        want to create and maintain your own infrastructure or worry about
        scalability.
      </v-alert>

      <p>
        There are two versions of Wappalyzer for Node.js:
      </p>

      <ul class="mb-4">
        <li>
          <a href="https://www.npmjs.com/package/wappalyzer" target="_blank"
            >wappalyzer</a
          >
        </li>
        <li>
          <a
            href="https://www.npmjs.com/package/wappalyzer-core"
            target="_blank"
            >wappalyzer-core</a
          >
        </li>
      </ul>

      <p>
        The first package is complete solution for identifying technologies on
        websites. It includes a headless browser, a crawler and methods to
        extract and analyse data. Pass it a URL and get all identified
        technologies returned in JSON format. The module can be used a
        standalone command-line tool or as a dependency in JavaScript projects
        and is available as a
        <a href="https://hub.docker.com/r/wappalyzer/cli/" target="_blank"
          >Docker image</a
        >.
      </p>

      <p>
        The core package exposes a low-level API and has no dependencies. It
        doesn't make network requests but instead accepts data such as HTML,
        response headers and cookies from an external source.
      </p>

      <p>
        Refer to the documentation linked above for installation and usage
        instructions and code examples.
      </p>
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
