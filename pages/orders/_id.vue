<template>
  <Page
    :title="title"
    :crumbs="[{ title: 'Orders', to: '/orders' }]"
    :loading="!order && !error"
    secure
  >
    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>

    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <template v-if="order">
      <v-alert v-if="order.status === 'Calculating'" type="info" outlined>
        Checking availability and price... This may take a few minutes. We will
        send you an email when your order is ready.
      </v-alert>

      <v-alert v-if="order.status === 'Failed'" type="error">
        Sorry, something went wrong during the processing of your order. Please
        contact us.
      </v-alert>

      <v-alert v-if="order.status === 'Insufficient'" type="warning">
        <p>
          Sorry, we don't have data available matching your requirements. Please
          try it again with different or no filters.
        </p>

        <v-btn to="/lists" outlined>
          <v-icon left>mdi-arrow-left</v-icon>
          Back to Lead lists
        </v-btn>
      </v-alert>

      <v-alert v-if="order.status === 'Open'" type="info" outlined>
        <template type="info">
          Your order has been created. Please make payment below to complete the
          purchase.
        </template>
      </v-alert>

      <v-alert v-if="order.status === 'Pending'" type="info" outlined>
        <template v-if="['Subscription'].includes(order.product)">
          Your card could not be charged automatically, please use the invoice
          to complete the payment. An additional step may be required by your
          card issuer to authorise the transaction.
        </template>
        <template v-else>
          Your order is awaiting payment. Please use the invoice to complete the
          purchase.
        </template>
      </v-alert>

      <v-alert v-if="order.status === 'Processing'" type="success">
        <template>
          Thank you for your payment, your order is being processed. You'll
          receive an email when it's ready.
        </template>
      </v-alert>

      <v-alert v-if="order.status === 'Complete'" type="success">
        <template v-if="order.product === 'Subscription'">
          Thank you for your payment, your subscription has been created.
        </template>
        <template
          v-else-if="['Lead list', 'Bulk lookup'].includes(order.product)"
        >
          Thank you for your payment, your list is ready.
        </template>
        <template v-else-if="order.product === 'Credits'">
          Thank you for your payment, credits have been added to your balance.
        </template>
        <template v-else>
          Thank you for your payment.
        </template>
      </v-alert>

      <v-btn
        v-if="isAdmin"
        :disabled="order.status === 'Complete'"
        color="success"
        outlined
        @click="
          {
            {
              user.billingEmail
            }
          }
          editDialog = true
        "
      >
        <v-icon left>mdi-pencil</v-icon>
        Edit order
      </v-btn>

      <v-btn
        v-if="
          (order.status === 'Pending' || order.status === 'Complete') &&
          order.invoiceUrl
        "
        :href="order.invoiceUrl"
        target="_blank"
        color="accent"
        outlined
      >
        <v-icon left>mdi-file-document-box-outline</v-icon>
        Invoice
      </v-btn>

      <template v-if="order.stripeSubscription">
        <v-btn
          :to="`/subscriptions/${order.stripeSubscription}`"
          color="accent"
          outlined
          ><v-icon left>mdi-calendar-repeat</v-icon>Subscription</v-btn
        >
      </template>

      <template
        v-if="
          order.product === 'Lead list' &&
          !['Insufficient', 'Failed'].includes(order.status)
        "
      >
        <v-btn
          v-if="order.dataset.filename"
          :href="`${datasetsBaseUrl}${order.dataset.filename}`"
          color="accent"
          outlined
          ><v-icon left>mdi-download</v-icon>Download list</v-btn
        >
        <v-btn
          v-else-if="order.dataset.sampleFilename"
          :href="`${datasetsBaseUrl}${order.dataset.sampleFilename}`"
          color="accent"
          outlined
          ><v-icon left>mdi-download</v-icon>Download sample</v-btn
        >
      </template>

      <template v-if="order.product === 'Bulk lookup'">
        <v-btn
          v-if="order.status === 'Complete'"
          :href="`${bulkLookupBaseUrl}${order.bulk.filename}`"
          color="accent"
          outlined
          ><v-icon left>mdi-download</v-icon>Download list</v-btn
        >
      </template>

      <v-card class="my-4">
        <v-card-text class="px-0 pb-0">
          <v-simple-table>
            <tbody>
              <tr>
                <th width="30%">ID</th>
                <td>
                  {{ order.id }}
                </td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  {{ order.status }}
                </td>
              </tr>
              <tr>
                <th>Date</th>
                <td>
                  {{ formatDate(new Date(order.createdAt * 1000)) }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>

        <v-card-actions v-if="order.status !== 'Complete'">
          <v-spacer />
          <v-btn color="error" text @click="cancelDialog = true">
            <v-icon left>mdi-cart-remove</v-icon>
            Cancel order
          </v-btn>
        </v-card-actions>

        <template>
          <v-divider />

          <v-card-title>
            {{ order.product }}
          </v-card-title>

          <v-card-text class="px-0">
            <v-simple-table v-if="order.product === 'Subscription'">
              <tbody>
                <tr>
                  <th width="30%">Plan</th>
                  <td>
                    {{ order.plan.name }}
                  </td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>
                    <template>
                      {{
                        formatCurrency(
                          order.plan.amount / 100,
                          order.plan.currency
                        )
                      }}
                      / {{ order.plan.interval }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <v-simple-table v-if="order.product === 'Lead list'">
              <tbody>
                <tr v-if="!['Insufficient', 'Failed'].includes(order.status)">
                  <th>
                    Rows
                  </th>
                  <td v-if="order.status === 'Calculating'">
                    <Spinner />
                  </td>
                  <td v-else>
                    {{ formatNumber(totalRows(order.dataset.rows)) }}
                  </td>
                </tr>
                <tr v-if="order.dataset.exclusionsFilename">
                  <th>
                    Exclusions
                  </th>
                  <td>
                    <v-btn
                      :href="`${datasetsBaseUrl}${order.dataset.exclusionsFilename}`"
                      color="accent"
                      icon
                      ><v-icon>mdi-download</v-icon></v-btn
                    >
                  </td>
                </tr>
                <tr>
                  <th width="30%">
                    Technologies
                    {{
                      ['Calculating', 'Insufficient', 'Failed'].includes(
                        order.status
                      )
                        ? ''
                        : '(rows)'
                    }}
                  </th>
                  <td>
                    <v-chip-group class="my-2" column>
                      <v-chip
                        v-for="{ slug, name } in technologies"
                        :key="slug"
                        outlined
                        small
                      >
                        {{ name }}
                        {{
                          !['Calculating', 'Insufficient', 'Failed'].includes(
                            order.status
                          )
                            ? ` (${formatNumber(order.dataset.rows[slug])})`
                            : ''
                        }}
                      </v-chip>

                      <v-chip
                        v-if="order.dataset.query.technologies.length > 20"
                        color="accent"
                        outlined
                        small
                        @click="technologiesViewAll = !technologiesViewAll"
                      >
                        <v-icon small left>{{
                          technologiesViewAll ? 'mdi-minus' : 'mdi-plus'
                        }}</v-icon>
                        {{
                          technologiesViewAll
                            ? 'View less'
                            : `View all ${order.dataset.query.technologies.length}`
                        }}
                      </v-chip>
                    </v-chip-group>
                  </td>
                </tr>
                <tr>
                  <th>
                    Attribute sets
                    {{
                      ['Calculating', 'Insufficient', 'Failed'].includes(
                        order.status
                      )
                        ? ''
                        : '(rows)'
                    }}
                  </th>
                  <td>
                    <v-chip-group class="my-2" column>
                      <v-tooltip
                        v-for="set in sets.filter(
                          ({ key }) =>
                            key === 'base-list' ||
                            order.dataset.sets.includes(key)
                        )"
                        :key="set.key"
                        bottom
                      >
                        <template v-slot:activator="{ on }">
                          <v-chip outlined small v-on="on">
                            {{ set.name }}
                            {{
                              ![
                                'Calculating',
                                'Insufficient',
                                'Failed',
                              ].includes(order.status)
                                ? ` (${formatNumber(
                                    set.key === 'base-list'
                                      ? totalRows(order.dataset.rows)
                                      : order.dataset.setRows[set.key] || 0
                                  )})`
                                : ''
                            }}
                          </v-chip>
                        </template>

                        {{
                          set.attributes
                            .map(({ name, key }) => name || key)
                            .join(', ')
                        }}
                      </v-tooltip>
                    </v-chip-group>
                  </td>
                </tr>
                <tr v-if="order.dataset.query.geoIps.length">
                  <th>
                    IP countries
                  </th>
                  <td>
                    <v-chip-group class="my-2" column>
                      <v-tooltip
                        v-for="{ text, value } in order.dataset.query.geoIps"
                        :key="value"
                        bottom
                      >
                        <template v-slot:activator="{ on }">
                          <v-chip outlined small v-on="on">
                            {{ value }}
                          </v-chip>
                        </template>

                        {{ text }}
                      </v-tooltip>
                    </v-chip-group>
                  </td>
                </tr>
                <tr v-if="order.dataset.query.tlds.length">
                  <th>
                    TLDs
                  </th>
                  <td>
                    <v-chip-group class="my-2" column>
                      <v-chip
                        v-for="tld in order.dataset.query.tlds"
                        :key="tld"
                        outlined
                        small
                        >{{ tld }}</v-chip
                      >
                    </v-chip-group>
                  </td>
                </tr>
                <tr v-if="order.dataset.query.languages.length">
                  <th>
                    Languages
                  </th>
                  <td>
                    <v-chip-group class="my-2" column>
                      <v-tooltip
                        v-for="{ text, value } in order.dataset.query.languages"
                        :key="value"
                        bottom
                      >
                        <template v-slot:activator="{ on }">
                          <v-chip outlined small v-on="on">
                            {{ value }}
                          </v-chip>
                        </template>

                        {{ text }}
                      </v-tooltip>
                    </v-chip-group>
                  </td>
                </tr>
                <tr v-if="order.dataset.query.matchAll">
                  <th>
                    Match all filters
                  </th>
                  <td>
                    <v-icon color="primary">mdi-checkbox-marked</v-icon>
                  </td>
                </tr>
                <tr v-if="order.dataset.query.subset">
                  <th>
                    Subset
                  </th>
                  <td>
                    {{ formatNumber(order.dataset.query.subset) }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <v-simple-table v-if="order.product === 'Bulk lookup'">
              <tbody>
                <tr>
                  <th width="30%">
                    Rows
                  </th>
                  <td>
                    {{ formatNumber(order.bulk.rows) }}
                  </td>
                </tr>
                <tr>
                  <th>
                    Attribute sets
                  </th>
                  <td>
                    <v-chip-group>
                      <v-tooltip
                        v-for="set in sets.filter(
                          ({ key }) =>
                            key === 'base-lookup' ||
                            order.bulk.sets.includes(key)
                        )"
                        :key="set.key"
                        bottom
                      >
                        <template v-slot:activator="{ on }">
                          <v-chip outlined small v-on="on">
                            {{ set.name }}
                          </v-chip>
                        </template>

                        {{
                          set.attributes
                            .map(({ name, key }) => name || key)
                            .join(', ')
                        }}
                      </v-tooltip>
                    </v-chip-group>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <v-simple-table v-if="order.product === 'Credits'">
              <tbody>
                <tr>
                  <th width="30%">
                    Credits
                  </th>
                  <td>
                    {{ formatNumber(order.credits) }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </template>

        <template
          v-if="
            !['Calculating', 'Insufficient', 'Failed'].includes(order.status)
          "
        >
          <v-divider />

          <v-card-title>
            Price
          </v-card-title>

          <v-card-text class="px-0">
            <v-simple-table v-if="order.paymentMethod === 'credits'">
              <tbody>
                <tr>
                  <th width="30%">Credits</th>
                  <td>
                    {{ formatNumber(order.totalCredits) }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-simple-table v-else>
              <tbody>
                <tr>
                  <th width="30%">Subotal</th>
                  <td>
                    {{
                      formatCurrency(order.subtotal / 100, order.currency, true)
                    }}
                  </td>
                </tr>
                <tr v-if="order.discount">
                  <th>
                    Discount
                  </th>
                  <td>
                    {{
                      formatCurrency(order.discount / 100, order.currency, true)
                    }}
                  </td>
                </tr>
                <tr>
                  <th>
                    Tax ({{
                      order.taxPercent &&
                      user.billingCountry.toLowerCase() === 'au'
                        ? 'GST '
                        : ''
                    }}{{ order.taxPercent }}%)
                  </th>
                  <td>
                    {{ formatCurrency(order.tax / 100, order.currency, true) }}
                  </td>
                </tr>
                <tr>
                  <th>
                    Total {{ order.status === 'Complete' ? '' : 'payable now' }}
                  </th>
                  <td>
                    <span class="font-weight-bold">
                      {{
                        formatCurrency(order.total / 100, order.currency, true)
                      }}
                    </span>
                    <AudToUsd
                      v-if="order.currency.toUpperCase() === 'AUD'"
                      :aud="order.total"
                    />
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </template>

        <template v-if="order.status === 'Open'">
          <v-divider />

          <v-card-title>
            Billing
          </v-card-title>
          <v-card-text class="px-0 pb-0">
            <v-alert v-if="accountSuccess" type="success" class="mx-4">
              {{ accountSuccess }}
            </v-alert>
            <v-alert
              v-if="!user.billingEmail"
              color="info"
              class="my-0 mx-4"
              outlined
            >
              No billing details provided.
            </v-alert>
            <v-simple-table v-else>
              <tbody>
                <tr>
                  <th width="30%">Name</th>
                  <td>{{ user.billingName }}</td>
                </tr>
                <tr>
                  <th>Email address</th>
                  <td>{{ user.billingEmail }}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>
                    {{ billingAddress }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="billingDialog = true"
              ><v-icon left>mdi-pencil</v-icon> Edit details</v-btn
            >
          </v-card-actions>

          <v-divider />

          <v-card-title>
            Payment
          </v-card-title>

          <v-card-text v-if="order.product !== 'Subscription'" class="px-0">
            <v-simple-table>
              <tbody>
                <tr>
                  <th width="30%">Method</th>
                  <td>
                    <v-radio-group
                      v-model="paymentMethod"
                      class="my-0"
                      hide-details
                      row
                    >
                      <v-radio label="Credit card" value="stripe" />
                      <v-radio label="PayPal" value="paypal" />
                      <v-radio
                        v-if="order.product !== 'Credits'"
                        label="Credit balance"
                        value="credits"
                      />
                    </v-radio-group>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <v-divider class="mt-4 mb-n4" />
          </v-card-text>

          <v-card-text v-if="paymentMethod === 'stripe'" class="pa-0">
            <v-alert
              v-if="order.product !== 'Subscription'"
              color="secondary"
              class="text-center"
            >
              Come here often? Save with a plan. See
              <nuxt-link to="/pricing">plans &amp; pricing</nuxt-link>.
            </v-alert>

            <div v-if="!cardsLoaded" class="d-flex justify-center pt-2 pb-6">
              <Progress />
            </div>

            <CreditCards
              mode-select
              @load="cardsLoaded = true"
              @select="(id) => (stripePaymentMethod = id)"
            />

            <v-divider />

            <div class="d-flex justify-center py-8">
              <v-btn
                :loading="paying"
                :disabled="!stripePaymentMethod || !user.billingEmail"
                color="primary"
                large
                @click="pay"
                ><v-icon left>mdi-credit-card</v-icon> Pay now</v-btn
              >
              <v-btn
                v-if="!order.product !== 'Subscription'"
                :loading="invoicing"
                :disabled="!user.billingEmail"
                class="ml-4"
                color="primary"
                large
                outlined
                @click="invoice"
                ><v-icon left>mdi-email</v-icon> Send invoice</v-btn
              >
            </div>
          </v-card-text>
          <v-card-text v-if="paymentMethod === 'paypal'" class="pa-0">
            <v-alert color="secondary" class="text-center">
              Come here often? Save with a plan. See
              <nuxt-link to="/pricing">plans &amp; pricing</nuxt-link>.
            </v-alert>

            <div class="d-flex justify-center mt-n4 py-8">
              <v-btn
                :loading="invoicing"
                :disabled="!user.billingEmail"
                class="primary"
                large
                @click="invoice"
              >
                <v-icon left>mdi-email</v-icon>
                Send invoice
              </v-btn>
            </div>
          </v-card-text>
          <template v-if="paymentMethod === 'credits'">
            <v-card-text v-if="paymentMethod === 'credits'" class="pa-0">
              <div
                :class="`d-flex justify-center pt-8${
                  credits < order.totalCredits ? '' : ' pb-8'
                }`"
              >
                <v-btn
                  :loading="paying"
                  :disabled="
                    !order.totalCredits || credits < order.totalCredits
                  "
                  class="primary"
                  large
                  @click="pay"
                >
                  <v-icon left>mdi-alpha-c-circle</v-icon>
                  Spend {{ formatNumber(order.totalCredits || 0) }} credits
                </v-btn>
              </div>
            </v-card-text>
            <v-card-actions v-if="credits < order.totalCredits">
              <v-spacer />
              <v-btn color="accent" text @click="billingDialog = true"
                ><v-icon left>mdi-alpha-c-circle</v-icon> Buy credits</v-btn
              >
            </v-card-actions>
          </template>
        </template>

        <template v-if="order.status === 'Complete'">
          <v-divider />

          <v-card-title>
            Payment
          </v-card-title>
          <v-card-text class="px-0">
            <v-simple-table>
              <tbody>
                <tr>
                  <th width="30%">Method</th>
                  <td v-if="order.paymentMethod === 'stripe'">
                    Credit card
                  </td>
                  <td v-if="order.paymentMethod === 'paypal'">
                    PayPal
                  </td>
                  <td v-if="order.paymentMethod === 'credits'">
                    Credit balance
                  </td>
                  <td v-else></td>
                </tr>
              </tbody>
            </v-simple-table>

            <v-divider class="mt-4 mb-n4" />
          </v-card-text>
        </template>
      </v-card>

      <small>Prices are in Australian dollars.</small>

      <v-dialog v-model="billingDialog" width="80%" max-width="700">
        <v-card>
          <Account
            class="mx-2"
            @save="accountSuccess = 'Your billing details have been updated'"
          />
        </v-card>
      </v-dialog>

      <v-dialog v-model="cancelDialog" max-width="400px" eager>
        <v-card>
          <v-card-title>
            Cancel order
          </v-card-title>
          <v-card-text>
            <v-alert v-if="cancelError" type="error">
              {{ cancelError }}
            </v-alert>

            <div>The order will be cancelled.</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="cancelDialog = false"
              >Cancel</v-btn
            >
            <v-btn :loading="cancelling" color="error" text @click="cancel"
              >Ok</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editDialog" max-width="400px" eager>
        <v-card>
          <v-card-title>
            Edit order
          </v-card-title>
          <v-card-text>
            <v-alert v-if="editError" type="error">
              {{ editError }}
            </v-alert>

            <v-form>
              <v-text-field v-model="order.userId" label="User ID" readonly />

              <v-text-field
                v-model="order.createdAt"
                label="Timestamp"
                readonly
              />

              <v-select v-model="status" :items="statusItems" label="Status" />

              <v-text-field
                v-if="!['Subscription', 'Credits'].includes(order.product)"
                v-model="totalCredits"
                label="Credits"
              />

              <v-text-field
                v-if="order.product !== 'Subscription'"
                v-model="discount"
                :label="`Discount (subtotal ${formatCurrency(
                  order.subtotal / 100,
                  order.currency
                )})`"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="editDialog = false"
              >Cancel</v-btn
            >
            <v-btn :loading="editing" color="accent" text @click="edit"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Page from '~/components/Page.vue'
import Account from '~/components/Account.vue'
import CreditCards from '~/components/CreditCards.vue'
import Progress from '~/components/Progress.vue'
import Spinner from '~/components/Spinner.vue'
import AudToUsd from '~/components/AudToUsd.vue'
import declineCodes from '~/assets/json/declineCodes.json'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page,
    Account,
    CreditCards,
    Progress,
    Spinner,
    AudToUsd,
  },
  data() {
    return {
      title: 'Order',
      accountSuccess: false,
      billingDialog: false,
      billingSuccess: false,
      cancelDialog: false,
      cancelError: false,
      cancelling: false,
      cardsLoaded: false,
      checks: 0,
      datasetsBaseUrl: process.env.DATASETS_BASE_URL,
      bulkLookupBaseUrl: process.env.BULK_LOOKUP_BASE_URL,
      declineCodes,
      discount: 0,
      editDialog: false,
      editError: false,
      editing: false,
      error: false,
      invoicing: false,
      order: null,
      orderLoaded: false,
      paymentMethod: 'stripe',
      paying: false,
      sets,
      status: '',
      statusItems: [
        'Open',
        'Calculating',
        'Pending',
        'Processing',
        'Insufficient',
        'Failed',
        'Complete',
      ],
      stripe: null,
      stripePaymentMethod: false,
      technologiesViewAll: false,
      totalCredits: 0,
      success: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isAdmin: ({ user }) => user.attrs.admin || user.impersonating,
      credits: ({ credits: { credits } }) => credits,
    }),
    billingAddress() {
      return [
        this.user.billingAddress1,
        this.user.billingAddress2,
        this.user.billingCity,
        this.user.billingPostcode,
        this.user.billingState,
        this.user.billingCountry,
      ]
        .filter((value) => value)
        .join(', ')
    },
    technologies() {
      return this.technologiesViewAll
        ? this.order.dataset.query.technologies
        : this.order.dataset.query.technologies.slice(0, 20)
    },
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        const { id } = this.$route.params

        try {
          this.order = (await this.$axios.get(`orders/${id}`)).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
    '$store.state.credits.credits'(credits) {
      if (
        this.order &&
        this.order.product !== 'Subscription' &&
        this.credits >= this.order.totalCredits
      ) {
        this.paymentMethod = 'credits'
      }
    },
    billingDialog(open) {
      if (open) {
        this.billingSuccess = false
      }
    },
    user() {
      this.billingDialog = false
    },
    order({ id, status, totalCredits, discount }) {
      this.status = status
      this.totalCredits = totalCredits
      this.discount = discount / 100

      if (status === 'Calculating') {
        setTimeout(async () => {
          this.checks += 1

          this.order = (await this.$axios.get(`orders/${id}`)).data
        }, Math.min(20000, 2000 + 100 * this.checks * this.checks))
      }

      if (!this.orderLoaded) {
        this.orderLoaded = true

        if (
          this.order.product !== 'Subscription' &&
          this.credits >= this.order.totalCredits
        ) {
          this.paymentMethod = 'credits'
        }
      }
    },
    paymentMethod() {
      this.cardsLoaded = false
      this.stripePaymentMethod = false
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      const { id } = this.$route.params

      try {
        this.getCredits()

        this.order = (await this.$axios.get(`orders/${id}`)).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  mounted() {
    this.stripe = this.$stripe.import()

    this.$gtag.event('begin_checkout')
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
    async pay() {
      this.error = false
      this.paying = true
      this.success = false

      try {
        const { id } = this.$route.params

        if (this.order.product === 'Subscription') {
          await this.$axios.patch(`orders/${id}`, {
            stripePaymentMethod:
              this.paymentMethod === 'stripe' ? this.stripePaymentMethod : null,
          })

          this.order = (await this.$axios.get(`orders/${id}`)).data
        } else if (this.paymentMethod === 'credits') {
          await this.$axios.patch(`orders/${id}`, {
            paymentMethod: 'credits',
          })

          this.order = (await this.$axios.get(`orders/${id}`)).data
        } else if (this.paymentMethod === 'stripe') {
          if (!this.order.stripePaymentIntent.id) {
            await this.$axios.patch(`orders/${id}`)

            this.order = (await this.$axios.get(`orders/${id}`)).data

            if (!this.order.stripePaymentIntent.id) {
              throw new Error(
                'The order is not in a payable state. Please contact us.'
              )
            }
          }

          const { clientSecret } = this.order.stripePaymentIntent

          const { paymentIntent, error } = await this.stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: this.stripePaymentMethod,
            }
          )

          if (error) {
            if (error.code === 'card_declined') {
              if (declineCodes[error.decline_code]) {
                throw new Error(declineCodes[error.decline_code])
              }
            }

            throw new Error(this.getErrorMessage(error))
          }

          if (paymentIntent.status === 'succeeded') {
            for (let attempt = 1; attempt <= 20; attempt += 1) {
              await new Promise((resolve, reject) => {
                setTimeout(async () => {
                  try {
                    this.order = (await this.$axios.get(`orders/${id}`)).data

                    resolve()
                  } catch (error) {
                    reject(new Error(this.getErrorMessage(error)))
                  }
                }, 500)
              })

              if (this.order.status === 'Complete') {
                if (this.order.paymentMethod !== 'credits') {
                  this.$gtag.purchase({
                    transaction_id: this.order.id,
                    value: this.order.total / 100,
                    currency: this.order.currency.toUpperCase(),
                    tax: this.order.tax / 100,
                    items: [
                      {
                        name: this.order.product,
                      },
                    ],
                  })
                }

                break
              }
            }

            if (
              this.order.status !== 'Processing' &&
              this.order.status !== 'Complete'
            ) {
              this.error =
                'Your payment was successful but the order failed to update. Please try reloading the page and contact us if the issue persists.'
            }
          }
        }
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.paying = false

      this.getCredits()

      this.scrollToTop()
    },
    async invoice() {
      this.error = false
      this.invoicing = true
      this.success = false

      try {
        const { id } = this.$route.params

        await this.$axios.patch(`orders/${id}`, {
          paymentMethod: this.paymentMethod,
          stripePaymentMethod:
            this.paymentMethod === 'stripe' ? this.stripePaymentMethod : null,
        })

        this.order = (await this.$axios.get(`orders/${id}`)).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.invoicing = false

      this.scrollToTop()
    },
    async cancel() {
      this.cancelError = false
      this.cancelling = true
      this.success = false

      try {
        const { id } = this.$route.params

        await this.$axios.delete(`orders/${id}`)

        this.$router.push({ path: '/orders' })
      } catch (error) {
        this.cancelError = this.getErrorMessage(error)
      }

      this.cancelling = false
    },
    async edit() {
      this.editError = false
      this.editing = true
      this.success = false

      try {
        const { id } = this.$route.params

        await this.$axios.patch(`orders/${id}`, {
          status: this.status,
          totalCredits: this.totalCredits,
          discount: Math.min(this.discount * 100, this.order.subtotal),
        })

        this.order = (await this.$axios.get(`orders/${id}`)).data

        this.success = 'The order has been updated'

        this.editDialog = false
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.editing = false

      this.scrollToTop()
    },
    totalRows(rows) {
      return Object.values(rows).reduce((total, rows) => total + rows, 0)
    },
  },
}
</script>
