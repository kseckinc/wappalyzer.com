<template>
  <Page :title="title" :loading="!orders && !error" secure>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <template v-if="orders">
      <v-card class="mb-4">
        <v-card-text v-if="!orders.length">
          <v-alert class="ma-0" color="info" outlined>
            <p>
              You don't have any orders.
            </p>

            <v-btn to="/" color="accent" outlined>
              Explore products
              <v-icon right>mdiArrowRight</v-icon>
            </v-btn>
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="20%">ID</th>
                <th width="20%">Status</th>
                <th width="20%">Date</th>
                <th width="20%">Product</th>
                <th width="20%">Total</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="order in orders">
                <tr :key="order.createdAt">
                  <td>
                    <nuxt-link :to="`/orders/${order.id}`">{{
                      order.id
                    }}</nuxt-link>
                  </td>
                  <td>{{ order.status }}</td>
                  <td>{{ formatDate(new Date(order.createdAt * 1000)) }}</td>
                  <td>
                    {{ order.product }}
                  </td>
                  <td v-if="order.status === 'Calculating'">
                    <Spinner />
                  </td>
                  <td v-else-if="order.status === 'Insufficient'">
                    -
                  </td>
                  <td v-else-if="order.paymentMethod === 'credits'">
                    {{ formatNumber(order.totalCredits) }}
                    Credits
                  </td>
                  <td v-else>
                    {{ formatCurrency(order.total / 100, order.currency) }}
                  </td>
                </tr>
              </template>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <small>Prices are in Australian dollars.</small>
    </template>
  </Page>
</template>

<script>
import { mdiArrowRight } from '@mdi/js'
import Page from '~/components/Page.vue'
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    Page,
    Spinner,
  },
  data() {
    return {
      title: 'Orders',
      error: false,
      orders: null,
      mdiArrowRight,
    }
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          this.orders = (await this.$axios.get('orders')).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        this.orders = (await this.$axios.get('orders')).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
}
</script>

<style>
.loader {
  animation: loader 1.5s infinite;
  display: flex;
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
