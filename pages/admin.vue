<template>
  <Page :title="title" narrow no-hero no-subscribe>
    <v-card class="mb-4">
      <v-card-title>
        Sign in as
      </v-card-title>
      <v-card-text>
        <v-alert v-if="success" type="success">
          {{ success }}
        </v-alert>
        <v-alert v-if="error" type="error">
          {{ error }}
        </v-alert>

        <v-form ref="form" @submit.prevent="submit">
          <v-text-field
            v-model="email"
            :rules="[(v) => !v || /@/.test(v) || 'Enter a valid email address']"
            label="Email address"
            required
            hide-details="auto"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn :loading="submitting" color="accent" text @click="submit">
          <v-icon left>mdi-account</v-icon>
          Sign in
        </v-btn>
      </v-card-actions>
    </v-card>
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
      title: 'Administration',
      email: '',
      error: false,
      submitting: false,
      success: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
    }),
  },
  created() {
    if (!this.user.admin) {
      return this.$nuxt.error({ statusCode: 404 })
    }
  },
  methods: {
    async submit() {
      this.error = false
      this.success = false
      this.submitting = true

      if (this.email && this.$refs.form.validate()) {
        this.$store.commit('user/setImpersonating', this.email)

        await new Promise((resolve) => {
          this.$nextTick(async () => {
            try {
              const user = (await this.$axios.get('user')).data

              this.$store.commit('user/setAttrs', user)

              this.success = `Signed in as ${this.email}`
              this.email = ''
            } catch (error) {
              this.$store.commit('user/setImpersonating', '')

              this.error = this.getErrorMessage(error)
            }

            resolve()
          })
        })
      }

      this.submitting = false
    },
  },
}
</script>
