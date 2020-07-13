<template>
  <Page :title="title" :loading="loading && !error" secure>
    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <template v-if="!loading">
      <p>Credits remaining: {{ credits }}</p>

      <v-card>
        <v-card-title>
          Packs
        </v-card-title>
        <v-card-text v-if="!add.length">
          <v-alert color="info" class="mb-0" outlined>
            You don't have any credit packs
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="20%">Description</th>
                <th width="20%">Added</th>
                <th width="20%">Expires</th>
                <th width="20%">Credits</th>
                <th width="20%">Remaining</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in add">
                <td>
                  {{ item.product }}
                </td>
                <td>
                  {{ formatDate(new Date(item.createdAt * 1000)) }}
                </td>
                <td>
                  {{ formatDate(new Date(item.expiresAt * 1000)) }}
                </td>
                <td>
                  {{ formatNumber(item.credits) }}
                </td>
                <td>
                  {{ formatNumber(item.creditsRemaining) }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>

        <v-divider />

        <v-card-title>
          Usage
        </v-card-title>
        <v-card-text v-if="!spend.length">
          <v-alert color="info" class="mb-0" outlined>
            You don't have credit usage.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th>Description</th>
                <th width="20%">Date</th>
                <th width="20%">Credits</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in spend">
                <td>
                  {{ item.product }}
                </td>
                <td>
                  {{ formatDate(new Date(item.createdAt * 1000)) }}
                </td>
                <td>
                  {{ formatNumber(item.credits) }}
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
import { mapState, mapActions } from 'vuex'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page
  },
  data() {
    return {
      title: 'Credits',
      add: [],
      spend: [],
      error: false,
      loading: true,
      success: false
    }
  },
  computed: {
    ...mapState({
      credits: ({ credits: { credits } }) => credits
    })
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          ;({ credits: this.credits } = (await this.$axios.get('credits')).data)
          ;({ usage: this.add } = (await this.$axios.get('credits/add')).data)
          ;({ usage: this.spend } = (
            await this.$axios.get('credits/spend')
          ).data)

          this.loading = false
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    }
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        await Promise.all([
          await this.getCredits(),
          ({ usage: this.add } = (await this.$axios.get('credits/add')).data),
          ({ usage: this.spend } = (
            await this.$axios.get('credits/spend')
          ).data)
        ])

        this.loading = false
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get'
    })
  }
}
</script>
