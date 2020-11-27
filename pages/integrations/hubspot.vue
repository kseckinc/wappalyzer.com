<template>
  <Page
    :title="title"
    :crumbs="[{ title: 'Integrations', to: '/integrations/' }]"
    secure
  >
    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <v-btn
      href="https://app.hubspot.com/oauth/authorize?scope=contacts&redirect_uri=https://www.wappalyzer.com/integrations/hubspot/&client_id=cac4bea5-5678-444c-902f-24f1d9f5e235"
      color="primary"
      large
      _target="blank"
      :loading="connecting"
      >Connect</v-btn
    >
  </Page>
</template>

<script>
import { mapState } from 'vuex'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Hubspot',
      code: null,
      connecting: false,
      success: null,
      error: null,
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
    }),
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn && this.code) {
        this.authenticate()
      }
    },
  },
  mounted() {
    const { code } = this.$route.query

    this.code = code

    if (this.isSignedIn) {
      this.authenticate()
    }
  },
  methods: {
    async authenticate() {
      this.connecting = true

      try {
        await this.$axios.post(`hubspot/auth/${this.code}`)
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.connecting = false
    },
  },
}
</script>
