<template>
  <div>
    <Page :title="title" :side="side" no-hero no-head>
      <h1 class="mb-4">
        Contributing
      </h1>

      <p>
        Wappalyzer is an
        <a
          href="https://github.com/aliasio/wappalyzer/blob/master/LICENSE"
          target="_blank"
          >MIT-licensed</a
        >, open source project written in JavaScript. Anyone is welcome to
        contribute.
      </p>

      <Heading id="getting-started" size="2" class="mt-8 mb-2">
        Getting started
      </Heading>

      <p>
        To get started, follow the
        <nuxt-link to="/docs/dev/setup/"> development setup</nuxt-link>
        instructions.
      </p>

      <Heading id="submitting-changed" size="2" class="mt-8 mb-2">
        Submitting changes
      </Heading>

      <ul>
        <li>
          First, run <code>yarn run validate</code> to identify any issues.
        </li>
        <li>
          Use descriptive commit messages, e.g. 'Add WordPress detection'.
        </li>
        <li>Push your commits to a new branch on your own fork.</li>
        <li>
          Finally, submit a
          <a
            href="https://help.github.com/articles/about-pull-requests/"
            target="_blank"
            >pull request</a
          >
          and describe your changes.
        </li>
      </ul>

      <Heading id="adding-a-new-technology" size="2" class="mt-8 mb-2">
        Adding a new technology
      </Heading>

      <p>
        Wappalyzer uses
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
          target="_blank"
          >regular expressions</a
        >
        to fingerprint technologies. Refer to the
        <nuxt-link to="/docs/dev/specification/">specification</nuxt-link> for
        detail.
      </p>

      <ul class="mb-4">
        <li>
          Add a new block to
          <a
            href="https://github.com/aliasio/wappalyzer/blob/master/src/technologies.json"
            target="_blank"
            ><code>src/technologies.json</code></a
          >.
        </li>
        <li>
          Add an icon to
          <a
            href="https://github.com/aliasio/wappalyzer/tree/master/src/drivers/webextension/images/icons"
            target="_blank"
            ><code>src/drivers/webextension/images/icons</code></a
          >. The image must be square, either SVG or PNG (32 x 32 pixels).
        </li>
      </ul>

      <v-alert :icon="mdiLightbulbOnOutline" outlined>
        Only widely used technologies are accepted. When creating a pull
        request, include ten or more links to websites that use the application,
        a GitHub page with at least 1,000 stars or anything that will help
        establish the size of the user base.
      </v-alert>

      <Heading id="adding-a-new-category" size="2" class="mt-8 mb-2">
        Adding a new category
      </Heading>

      <p>
        Please
        <a href="https://github.com/aliasio/wappalyzer/issues" target="_blank"
          >open an issue on GitHub</a
        >
        first to discuss the need for a new category.
      </p>

      <p>
        To add a category, edit
        <a
          href="https://github.com/aliasio/wappalyzer/blob/master/src/technologies.json"
          target="_blank"
          ><code>src/technologies.json</code></a
        >
        and update every
        <a
          href="https://github.com/aliasio/wappalyzer/tree/master/src/drivers/webextension/_locales"
          target="_blank"
          g
          >locale</a
        >. You may use the English category name in all of them.
      </p>

      <Heading id="adding-a-new-translation" size="2" class="mt-8 mb-2">
        Adding a new translation
      </Heading>

      <p>
        To add a new translation, copy the <code>en</code> folder in
        <a
          href="https://github.com/aliasio/wappalyzer/tree/master/src/drivers/webextension/_locales"
          target="_blank"
          ><code>src/drivers/webextension/_locales</code></a
        >, rename it to the relevant two-letter country code and update the
        containing <code>messages.json</code> file.
      </p>

      <Heading id="adding-a-new-feature" size="2" class="mt-8 mb-2">
        Adding a new feature
      </Heading>

      <p>
        Please
        <a href="https://github.com/aliasio/wappalyzer/issues" target="_blank"
          >open an issue on GitHub</a
        >
        first. New features and large changes are rarely accepted without prior
        discussion.
      </p>
    </Page>
  </div>
</template>

<script>
import { mdiLightbulbOnOutline } from '@mdi/js'

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
      title: 'Developer documentation',
      mdiLightbulbOnOutline,
      side,
    }
  },
}
</script>
