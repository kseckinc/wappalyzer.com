<template>
  <div>
    <Page :title="title" hero narrow>
      <p class="mb-8">
        Wappalyzer is available as a
        <a href="https://nodejs.org" target="_blank">Node.js</a> module under an
        <a
          href="https://raw.githubusercontent.com/AliasIO/wappalyzer/master/LICENSE"
          target="_blank"
          >open source license</a
        >
        permitting both personal and commercial use. This is the same code that
        powers the <nuxt-link to="/download">browser extension</nuxt-link> and
        <nuxt-link to="/api">APIs</nuxt-link>. The project is largely community
        driven, upstream
        <nuxt-link to="/docs/dev/contributing">contributions</nuxt-link>
        are encouraged.
      </p>

      <v-btn
        href="https://www.npmjs.com/package/wappalyzer"
        color="accent"
        target="_blank"
        outlined
      >
        <v-icon left>mdi-npm</v-icon>
        NPM package
      </v-btn>

      <v-btn
        href="https://hub.docker.com/r/wappalyzer/cli/"
        color="accent"
        target="_blank"
        outlined
      >
        <v-icon left>mdi-docker</v-icon>
        Docker image
      </v-btn>

      <v-btn
        href="https://github.com/aliasio/wappalyzer"
        color="accent"
        target="_blank"
        outlined
      >
        <v-icon left>mdi-git</v-icon>
        Source code
      </v-btn>

      <v-alert icon="mdi-lightbulb-on-outline" class="mt-10" outlined>
        Consider using the <nuxt-link to="/api">APIs</nuxt-link> if you do not
        want to create and maintain your own infrastructure or worry about
        scalability.
      </v-alert>

      <h3 class="mt-8 mb-4">Attribution</h3>

      <p>
        Attribution is optional but appreciated. If you're using Wappalyzer in
        your own software or service, please display a link back to us:
      </p>

      <p class="font-italic">
        Powered by <a href="https://www.wappalyzer.com">Wappalyzer</a>
      </p>
    </Page>
  </div>
</template>

<script>
import Page from '~/components/Page.vue'

export default {
  components: {
    Page
  },
  data() {
    return {
      title: 'Node.js module'
    }
  }
}
</script>
