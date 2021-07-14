<template>
  <div>
    <v-divider class="mb-8" />

    <v-container class="mb-10">
      <p class="body-2 mb-6 text-center">
        Subscribe to receive occasional product updates.
      </p>

      <div class="ma-auto" style="max-width: 500px">
        <v-alert v-if="success" type="success" class="mb-0" text>
          {{ success }}
        </v-alert>

        <v-alert v-if="error" type="error" text>
          {{ error }}
        </v-alert>

        <v-form
          v-if="!success"
          ref="form"
          class="d-flex align-center"
          @submit.prevent="subscribe"
        >
          <v-text-field
            v-model="email"
            :rules="[(v) => !v || /@/.test(v)]"
            placeholder="info@example.com"
            height="44px"
            dense
            outlined
            hide-details
          />
          <v-btn
            :loading="subscribing"
            color="primary lighten-1"
            class="ml-2 primary--text"
            large
            depressed
            @click="subscribe"
          >
            <v-icon left>
              {{ mdiEmail }}
            </v-icon>
            Subscribe
          </v-btn>
        </v-form>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mdiEmail } from '@mdi/js'

export default {
  data() {
    return {
      email: '',
      error: false,
      mdiEmail,
      success: false,
      subscribing: false,
    }
  },
  methods: {
    async subscribe() {
      this.error = false
      this.success = false

      if (this.$refs.form.validate()) {
        this.subscribing = true

        try {
          await this.$axios.put(`subscribers/${this.email}`)

          this.success = 'Thank you for subscribing!'
          this.email = ''
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }

        this.subscribing = false
      }
    },
  },
}
</script>
