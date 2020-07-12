<template>
  <Page :title="title" :loading="loading && !error" secure>
    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <template v-if="!loading">
      <v-card>
        <v-card-text v-if="!usage.length" class="pb-0">
          <v-alert color="info" class="mb-0" outlined>
            You don't have credit usage.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th>Expires at</th>
                <th>Product</th>
                <th>Add</th>
                <th>Spend</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in usage">
                <td>{{ formatDate(new Date(item.expiresAt * 1000)) }}</td>
                <td>
                  {{ item.product }}
                </td>
                <td>
                  {{ item.credits &gt; 0 ? formatNumber(item.credits) : '' }}
                </td>
                <td>
                  {{
                    item.credits &lt; 0 ? formatNumber(Math.abs(item.credits)) : ''
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
import Page from '~/components/Page.vue'

export default {
  components: {
    Page
  },
  data() {
    return {
      title: 'Credits',
      usage: [],
      error: false,
      loading: true,
      success: false
    }
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          ;({ usage: this.usage } = (
            await this.$axios.get('credits/usage')
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
        ;({ usage: this.usage } = (await this.$axios.get('credits/usage')).data)

        this.loading = false
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  }
}
</script>
