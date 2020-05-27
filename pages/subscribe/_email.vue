<template>
  <Page :title="title" :loading="subscribing" no-heading no-subscribe>
    <v-alert v-if="success" type="success" outlined>
      {{ success }}
    </v-alert>

    <v-alert v-if="error" type="error" outlined>
      {{ error }}
    </v-alert>
  </Page>
</template>

<script>
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
      title: 'Subscribe',
      subscribing: true,
      error: false,
      success: false
    }
  },
  async created() {
    const { email } = this.$route.params

    try {
      await this.$axios.put(`subscribers/${email}`)

      this.success = 'Thank you for subscribing!'
    } catch (error) {
      this.error = this.getErrorMessage(error)
    }

    this.subscribing = false
  }
}
</script>
