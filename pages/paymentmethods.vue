<template>
  <Page :title="title" :loading="!cardsLoaded" secure>
    <v-card class="mb-4">
      <v-card-title>Credit cards</v-card-title>

      <CreditCards v-on:load="cardsLoaded = true" />

      <v-divider />

      <v-card-title>PayPal</v-card-title>

      <v-card-text v-if="!user.billingEmail" class="pb-0">
        <v-alert color="info" class="mb-0" outlined>
          You haven't provided a billing email address.
        </v-alert>
      </v-card-text>
      <v-card-text v-else class="px-0 pb-0">
        <v-alert v-if="accountSuccess" type="success" class="mx-4">
          {{ accountSuccess }}
        </v-alert>

        <v-simple-table>
          <tbody>
            <tr>
              <th width="30%">Billing email address</th>
              <td>{{ user.billingEmail }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="billingDialog = true" color="accent" text
          ><v-icon left>mdi-pencil</v-icon> Edit details</v-btn
        >
      </v-card-actions>

      <v-divider />

      <v-card-title>Credits</v-card-title>

      <v-card-text class="px-0 pb-0">
        <v-simple-table>
          <tbody>
            <tr>
              <th width="30%">Balance</th>
              <td>
                <Spinner v-if="credits === null" />
                <template v-else>
                  {{ formatNumber(credits) }}
                </template>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          :to="{ path: '/credits', query: { buy: true } }"
          color="accent"
          text
          ><v-icon left>mdi-alpha-c-circle</v-icon> Buy credits</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-dialog v-model="billingDialog" width="80%" max-width="700">
      <v-card>
        <Account
          v-on:save="accountSuccess = 'Your billing details have been updated'"
          class="mx-2"
        />
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Page from '~/components/Page.vue'
import Account from '~/components/Account.vue'
import CreditCards from '~/components/CreditCards.vue'
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    Page,
    Account,
    CreditCards,
    Spinner
  },
  data() {
    return {
      title: 'Payment methods',
      accountSuccess: false,
      billingDialog: false,
      cardsLoaded: false
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      credits: ({ credits }) => credits.credits
    })
  },
  watch: {
    billingDialog(open) {
      if (open) {
        this.billingSuccess = false
      }
    },
    user() {
      this.billingDialog = false
    }
  },
  created() {
    this.getCredits()
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get'
    })
  }
}
</script>
