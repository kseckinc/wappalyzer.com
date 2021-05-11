<template>
  <Page :title="title" :hero="false" no-subscribe>
    <v-card class="mb-6" max-width="600px">
      <v-card-title class="subtitle-2">Sign in as</v-card-title>
      <v-card-text>
        <v-alert v-if="success" type="success">
          {{ success }}
        </v-alert>
        <v-alert v-if="error" type="error">
          {{ error }}
        </v-alert>

        <v-form ref="form" :disabled="isImpersonator" @submit.prevent="submit">
          <v-text-field
            v-model="userId"
            label="Email address or user ID"
            class="mb-8"
            required
            hide-details="auto"
          />

          <v-btn
            :loading="submitting"
            color="primary"
            depressed
            @click="submit"
          >
            Sign in
          </v-btn>
        </v-form>
      </v-card-text>
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
      title: 'Admin',
      userId: this.$route.params.userId || '',
      error: false,
      recentOrders: {},
      submitting: false,
      success: false,
      stats: null,
      lineChartOptions: {
        series: {
          0: {
            lineDashStyle: [2, 2],
            lineWidth: 2,
          },
        },
        lineWidth: 2,
        legend: { position: 'top' },
        colors: ['#a182d5', '#4608ad'],
      },
      columnChartOptions: {
        isStacked: true,
        legend: { position: 'top' },
      },
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isImpersonator: ({ user }) => !!user.impersonator,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
    }),
  },
  created() {
    if (!this.isAdmin || this.isImpersonator) {
      return this.$nuxt.error({ statusCode: 404 })
    }
  },
  methods: {
    async submit() {
      this.error = false
      this.success = false
      this.submitting = true

      if (this.userId && this.$refs.form.validate()) {
        try {
          await this.signInAs(this.userId)

          this.userId = ''

          this.$router.push('/account')
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }

      this.submitting = false
    },
  },
}
</script>
