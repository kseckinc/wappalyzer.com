<template>
  <div>
    <Page :title="title" no-head narrow>
      <h1 class="text-h1 mb-8">{{ title }}</h1>

      <p>
        Wappalyzer, founded by
        <a
          href="https://www.linkedin.com/in/elbertalias/"
          target="_blank"
          rel="noopener noreferrer"
          >Elbert Alias<v-icon color="accent" class="ml-1">
            {{ mdiLinkedin }}</v-icon
          ></a
        >
        in 2008, is a technology profiler and leads data provider. Our products
        provide sales and marketing teams with technographic insights for lead
        generation, market analysis and competitor research.
      </p>

      <p>
        We track over a thousand web technologies across millions of websites.
        We know who uses your software and that of your competitors.
      </p>

      <v-btn to="/faq/extension/" color="accent" class="mt-4" outlined>
        <v-icon left>{{ mdiForum }}</v-icon>
        Frequently asked questions
      </v-btn>

      <h2 class="text-h2 mt-8 mb-2">Get in touch</h2>

      <p>
        We love to hear from you. If you have any comments, questions or
        suggestions, please don't hesitate to
        <nuxt-link to="/contact/">contact us</nuxt-link>.
      </p>

      <template v-slot:footer>
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
