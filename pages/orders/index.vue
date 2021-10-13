<template>
  <Page :title="title" :loading="!orders && !error" secure>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <div v-if="isMember" class="mb-4 text-right">
      <v-switch
        v-if="orders && orders.length !== myOrders.length"
        v-model="viewMine"
        class="ma-0 d-inline-block"
        label="Show only my orders"
        hide-details
      />
    </div>

    <template v-if="orders">
      <v-card class="mb-4">
        <v-card-text v-if="!filteredOrders.length">
          <v-alert class="ma-0" color="info" text>
            <p>You don't have any orders.</p>

            <v-btn to="/" color="accent" outlined>
              Explore products
              <v-icon right>
                {{ mdiArrowRight }}
              </v-icon>
            </v-btn>
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Date</th>
                <th>Description</th>
                <th width="1">Total</th>
                <th width="1"></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="order in filteredOrders">
                <v-hover v-slot="{ hover }">
                  <tr :key="order.createdAt">
                    <td>
                      <nuxt-link :to="`/orders/${order.id}`">
                        {{ order.id }}
                      </nuxt-link>
                    </td>
                    <td>
                      <v-chip
                        :color="
                          order.status === 'Complete'
                            ? 'success'
                            : order.status === 'Pending'
                            ? 'warning'
                            : order.status === 'Failed'
                            ? 'error'
                            : 'accent'
                        "
                        label
                        outlined
                        small
                      >
                        {{ order.status }}
                      </v-chip>
                    </td>
                    <td>{{ formatDate(new Date(order.createdAt * 1000)) }}</td>
                    <td>
                      <template v-if="order.name">
                        {{ order.name }}
                      </template>
                      <template v-else>
                        {{ order.product }}
                      </template>
                    </td>
                    <td v-if="order.status === 'Calculating'">
                      <Spinner />
                    </td>
                    <td v-else-if="order.status === 'Insufficient'">-</td>
                    <td v-else-if="order.paymentMethod === 'free'">Free</td>
                    <td
                      style="white-space: nowrap"
                      v-else-if="
                        order.product !== 'Subscription' &&
                        (order.paymentMethod === 'credits' ||
                          isMember ||
                          (order.totalCredits && credits > order.totalCredits))
                      "
                    >
                      {{ formatNumber(order.totalCredits) }}
                      Credits
                    </td>
                    <td style="white-space: nowrap" v-else>
                      {{ formatCurrency(order.total / 100, order.currency) }}
                    </td>
                    <td style="white-space: nowrap">
                      <div :style="hover ? '' : 'visibility: hidden'">
                        <v-btn
                          color="accent"
                          icon
                          @click="
                            selected = order
                            editDialog = true
                          "
                        >
                          <v-icon>{{ mdiPencil }}</v-icon> </v-btn
                        ><v-btn
                          :disabled="order.status === 'Complete'"
                          color="error"
                          icon
                          @click="
                            selected = order
                            cancelDialog = true
                          "
                        >
                          <v-icon>{{ mdiDelete }}</v-icon>
                        </v-btn>
                      </div>
                    </td>
                  </tr>
                </v-hover>
              </template>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <small class="text--disabled">Prices are in United States dollars.</small>
    </template>

    <v-dialog v-model="editDialog" max-width="400px" eager>
      <v-card>
        <v-card-title>Edit order</v-card-title>
        <v-card-text>
          <v-alert v-if="editError" type="error" text>
            {{ editError }}
          </v-alert>

          <p>Name your order so you can find it back later.</p>

          <v-form ref="form" @submit.prevent="edit">
            <v-text-field
              v-model="selected.name"
              label="Name"
              :rules="[(v) => (v && v.length > 250 ? 'Name too long' : true)]"
              placeholder="My list"
              hide-details="auto"
              dense
              outlined
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="editDialog = false">
            Cancel
          </v-btn>
          <v-btn :loading="editing" color="error" text @click="edit">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="cancelDialog" max-width="400px" eager>
      <v-card>
        <v-card-title>Cancel order</v-card-title>
        <v-card-text>
          <v-alert v-if="cancelError" type="error" text>
            {{ cancelError }}
          </v-alert>

          <div>
            The order <strong>{{ selected.id }}</strong> will be cancelled.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="cancelDialog = false">
            Cancel
          </v-btn>
          <v-btn :loading="cancelling" color="error" text @click="cancel">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import { mapState } from 'vuex'
import { mdiArrowRight, mdiPencil, mdiDelete } from '@mdi/js'
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
      cancelDialog: false,
      cancelError: false,
      cancelling: false,
      editDialog: false,
      editError: false,
      editing: false,
      error: false,
      orders: null,
      mdiArrowRight,
      mdiPencil,
      mdiDelete,
      selected: {},
      viewMine: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isMember: ({ user }) =>
        !user.attrs.admin && user.impersonator && !user.impersonator.admin,
      credits: ({ credits: { credits } }) => credits,
      impersonator: ({ user }) => user.impersonator,
    }),
    myOrders() {
      return this.orders.filter(
        ({ memberId }) => memberId === this.impersonator.sub
      )
    },
    filteredOrders() {
      return this.viewMine ? this.myOrders : this.orders
    },
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
  methods: {
    async edit() {
      this.editError = false
      this.editing = true

      try {
        await this.$axios.patch(`orders/${this.selected.id}`, {
          name: this.selected.name,
        })

        try {
          this.orders = (await this.$axios.get('orders')).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }

        this.editDialog = false
      } catch (error) {
        this.editError = this.getErrorMessage(error)
      }

      this.editing = false
    },
    async cancel() {
      this.cancelError = false
      this.cancelling = true

      try {
        await this.$axios.delete(`orders/${this.selected.id}`)

        try {
          this.orders = (await this.$axios.get('orders')).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }

        this.cancelDialog = false
      } catch (error) {
        this.cancelError = this.getErrorMessage(error)
      }

      this.cancelling = false
    },
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
