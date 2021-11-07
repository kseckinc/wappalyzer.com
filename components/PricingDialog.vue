<template>
  <v-dialog v-model="isOpen" max-width="400px">
    <v-card>
      <v-card-title>Pricing</v-card-title>
      <v-card-text class="px-0 pb-0">
        <v-alert color="primary lighten-1 primary--text" class="px-6" tile>
          Pay with a credit card, PayPal or credit balance.
          <nuxt-link to="/pricing" class="primary--text">
            Sign up for a plan
          </nuxt-link>
          to get monthly credits at a lower price.
        </v-alert>
      </v-card-text>
      <v-card-text class="px-0 pb-0">
        <v-simple-table class="mb-4" outlined dense>
          <thead>
            <tr>
              <th class="pl-6" width="50%">
                {{ unit.unit }}
              </th>
              <th
                v-if="units.length > 1"
                class="pr-6 py-1 font-weight-regular"
                width="50%"
              >
                <v-select
                  v-model="selectedUnit"
                  :items="
                    units.map(({ per: text }, value) => ({ text, value }))
                  "
                  label="Price per"
                  hide-details
                  outlined
                  dense
                />
              </th>
              <th v-else class="pr-6" width="50%">Price per {{ unit.per }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(tier, index) in Object.keys(creditTiers)">
              <tr v-if="!unit.max || tier <= unit.max" :key="index">
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
                      (creditTiers[tier] * unit.credits) / 100,
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
              (v) =>
                !unit.min || v >= unit.min || `Min. ${formatNumber(unit.min)}`,
              (v) =>
                !unit.max || v <= unit.max || `Max. ${formatNumber(unit.max)}`,
            ]"
            :label="unit.unit"
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
                            (unit.min
                              ? Math.max(
                                  unit.min,
                                  unit.max ? Math.min(unit.max, value) : value
                                )
                              : value) * unit.credits,
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
                      (unit.min
                        ? Math.max(
                            unit.min,
                            unit.max ? Math.min(unit.max, value) : value
                          )
                        : value) * unit.credits
                    )
                  }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="accent" text @click="close"> Close </v-btn>
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
    const credits = creditsPerUnit[this.product] || {}

    return {
      isOpen: false,
      creditsPerUnit,
      creditTiers,
      units: credits.units,
      minPrice: credits.minPrice || 0,
      value: 1000,
      selectedUnit: 0,
    }
  },
  computed: {
    unit() {
      return this.units[this.selectedUnit]
    },
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
