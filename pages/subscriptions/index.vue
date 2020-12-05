<template>
  <Page :title="title" :loading="!subscriptions && !error" secure>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <div class="mb-4">
      <v-btn href="/pricing/" color="accent" outlined>
        <v-icon left>{{ mdiCalculator }}</v-icon>
        Plans &amp; pricing
      </v-btn>
    </div>

    <template v-if="subscriptions">
      <v-card>
        <v-card-text v-if="!subscriptions.length">
          <v-alert class="ma-0" color="info" outlined>
            You don't have any subscriptions.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th>Plan</th>
                <th>Status</th>
                <th>Renewal status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subscription in subscriptions" :key="subscription.id">
                <td>
                  <nuxt-link :to="`/subscriptions/${subscription.id}`">{{
                    subscription.planName
                  }}</nuxt-link>
                </td>
                <td>{{ subscription.status }}</td>
                <td v-if="subscription.cancelAt" class="red--text">
                  Cancels at
                  {{ formatDate(new Date(subscription.cancelAt * 1000)) }}
                </td>
                <td v-else>
                  Renews after
                  {{
                    formatDate(new Date(subscription.currentPeriodEnd * 1000))
                  }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </template>
  </Page>
</template>

<script>
import { mdiCalculator } from '@mdi/js'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Subscriptions',
      error: false,
      subscriptions: null,
      mdiCalculator,
    }
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          this.subscriptions = (await this.$axios.get('subscriptions')).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        this.subscriptions = (await this.$axios.get('subscriptions')).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
}
</script>
