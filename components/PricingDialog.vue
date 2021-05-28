<template>
  <v-dialog v-model="isOpen" max-width="400px">
    <v-card v-for="({ unit, per, credits }, i) in units" :key="i">
      <v-card-title> Pricing </v-card-title>
      <v-card-text class="px-0 pb-0">
        <v-alert color="primary lighten-1 primary--text" class="px-6">
          Pay with a credit card, PayPal or credit balance.
          <nuxt-link to="/pricing" class="primary--text"
            >Sign up for a plan</nuxt-link
          >
          to get monthly credits at a lower price.
        </v-alert>
      </v-card-text>
      <v-card-text class="px-0 pb-0">
        <v-simple-table class="mb-4" outlined dense>
          <thead>
            <tr>
              <th class="pl-6" width="50%">{{ unit }}</th>
              <th class="pr-6" width="50%">Price per {{ per }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(tier, index) in Object.keys(creditTiers)">
              <tr v-if="tier <= max" :key="index">
                <td class="pl-6 caption">
                  {{
                    formatNumber(
                      index
                        ? parseInt(Object.keys(creditTiers)[index - 1], 10) + 1
                        : 1
                    )
                  }}
                  {{
                    index === Object.keys(creditTiers).length - 1
                      ? '+'
                      : `- ${formatNumber(parseInt(tier, 10))}`
                  }}
                </td>
                <td class="pr-6 caption">
                  {{
                    formatCurrency(
                      (creditTiers[tier] * credits) / 100,
                      'USD',
                      true
                    )
                  }}
                </td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>
      </v-card-text>

      <v-divider />

      <v-card-title>Calculator</v-card-title>
      <v-card-text class="px-0 pb-0">
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="value"
            :rules="[
              (v) => /^[0-9]+$/.test(value) || 'Value should be numeric',
              (v) => !min || v >= min || `Min. ${formatNumber(min)}`,
              (v) => !max || v <= max || `Max. ${formatNumber(max)}`,
            ]"
            :label="unit"
            class="px-6 mb-n2"
            placeholder="1000"
            outlined
            dense
          />

          <v-simple-table outlined dense>
            <tbody>
              <tr>
                <th class="pl-6 caption font-weight-bold">Price ($)</th>
                <td class="pr-6 caption">
                  {{
                    formatCurrency(
                      Math.max(
                        minPrice,
                        creditsToCents(
                          parseInt(
                            (min
                              ? Math.max(
                                  min,
                                  max ? Math.min(max, value) : value
                                )
                              : value) * credits,
                            10
                          )
                        )
                      ) / 100
                    )
                  }}
                </td>
              </tr>
              <tr>
                <th class="pl-6 caption font-weight-bold">Price (credits)</th>
                <td class="pr-6 caption">
                  {{
                    formatNumber(
                      (min
                        ? Math.max(min, max ? Math.min(max, value) : value)
                        : value) * credits
                    )
                  }}
                </td>
              </tr>
            </tbody></v-simple-table
          >
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="accent" text @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { creditsPerUnit, creditTiers } from '~/assets/json/pricing.json'

export default {
  props: {
    product: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isOpen: false,
      creditsPerUnit,
      creditTiers,
      units: creditsPerUnit[this.product].units,
      minPrice: creditsPerUnit[this.product].minPrice || 0,
      min: creditsPerUnit[this.product].min || 0,
      max: creditsPerUnit[this.product].max,
      value: 1000,
    }
  },
  methods: {
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false

      this.$emit('close')
    },
  },
}
</script>
