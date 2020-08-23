<template>
  <Page :title="title" :loading="unsubscribing" no-hero no-heading no-subscribe>
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
    Page,
  },
  data() {
    return {
      title: 'Unsubscribe',
      unsubscribing: true,
      error: false,
      success: false,
    }
  },
  async created() {
    const { email } = this.$route.params

    try {
      await this.$axios.delete(`subscribers/${email}`)

      this.success = 'You have been unsubscribed from our mailing list.'
    } catch (error) {
      this.error = this.getErrorMessage(error)
    }

    this.unsubscribing = false
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
