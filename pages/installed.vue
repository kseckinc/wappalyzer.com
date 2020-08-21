<template>
  <Page :title="title" no-heading>
    <v-row>
      <v-col md="8" class="py-0">
        <p>
          Thank you for installing the Wappalyzer browser extension!
        </p>

        <h3 class="mt-10 mb-2">How it works</h3>

        <ol>
          <li>Go to any website</li>
          <li>Click the icon for a list of identified technologies</li>
          <li>Click on a technology or category for more insights</li>
        </ol>

        <v-btn color="accent" to="/faq/extension" class="mt-12" outlined>
          Frequently asked questions
        </v-btn>
      </v-col>
      <v-col cols="4" class="d-none d-md-flex align-start pl-12">
        <v-img src="/images/extension-2.svg" class="ml-sm-8 mb-4" />
      </v-col>
    </v-row>
  </Page>
</template>

<script>
import { mapActions } from 'vuex'
import Page from '~/components/Page.vue'

export default {
  components: {
    Page
  },
  head() {
    return {
      title: this.title
    }
  },
  data() {
    return {
      title: 'Installation successful',
      release: null,
      error: false
    }
  },
  created() {
    this.set({})
  },
  methods: {
    ...mapActions({
      set: 'page/set'
    })
  }
}
</script>
