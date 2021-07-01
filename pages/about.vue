<template>
  <div>
    <Page :title="title" no-head narrow>
      <h1 class="text-h1 mb-8">
        {{ title }}
      </h1>

      <p>
        Wappalyzer, founded by
        <a
          href="https://www.linkedin.com/in/elbertalias/"
          target="_blank"
          rel="noopener noreferrer"
          >Elbert Alias<v-icon color="accent" class="ml-1 mb-2" small>
            {{ mdiLinkedin }}</v-icon
          ></a
        >
        in 2008, is a technology profiler and lead data provider. Our products
        provide sales and marketing teams with technographic insights and tools
        for lead generation, market analysis and competitor research.
      </p>

      <p>
        We track over a thousand web technologies across millions of websites.
        We know who uses your software and that of your competitors.
      </p>

      <v-btn to="/faq/lists/" class="mt-4" depressed>
        <v-icon left>
          {{ mdiForum }}
        </v-icon>
        Frequently asked questions
      </v-btn>

      <h3 class="text-h3 mt-8 mb-2">Get in touch</h3>

      <p>
        We love to hear from you. If you have any comments, questions or
        suggestions, please don't hesitate to
        <nuxt-link to="/contact/"> contact us </nuxt-link>.
      </p>

      <template #footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import { mdiLinkedin, mdiForum } from '@mdi/js'
import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'

export default {
  components: {
    Page,
    Logos,
  },
  data() {
    return {
      title: 'About us',
      mdiLinkedin,
      mdiForum,
    }
  },
}
</script>
