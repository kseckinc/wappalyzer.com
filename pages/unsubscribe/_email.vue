<template>
  <Page :title="title" no-hero no-heading no-subscribe narrow>
    <p class="mb-8" style="max-width: 600px">
      Unsubscribe from all marketing communications. You may still receive
      transactional emails.
    </p>

    <v-alert v-if="success" type="success" outlined>
      {{ success }}
    </v-alert>

    <v-alert v-if="error" type="error" outlined>
      {{ error }}
    </v-alert>

    <v-card v-if="!success" class="mb-6">
      <v-card-title class="subtitle-2"> Email address </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submit">
          <v-text-field
            v-model="email"
            label="Email address"
            class="mb-8"
            required
            hide-details="auto"
            placeholder="info@example.com"
          />

          <v-btn
            :loading="unsubscribing"
            color="primary"
            depressed
            @click="submit"
          >
            Unsubscribe
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
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
      email: '',
      unsubscribing: false,
      error: false,
      success: false,
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  created() {
    ;({ email: this.email } = this.$route.params)

    this.submit()
  },
  methods: {
    async submit() {
      this.error = false
      this.success = false

      if (!this.email) {
        return
      }

      this.unsubscribing = true

      try {
        await this.$axios.delete(`subscribers/${this.email}`)

        this.success = 'You have been unsubscribed from our mailing list.'
      } catch (error) {
        // this.error = this.getErrorMessage(error)
        this.success = 'You have been unsubscribed from our mailing list.'
      }

      this.unsubscribing = false
    },
  },
}
</script>
