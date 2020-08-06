<template>
  <v-dialog v-model="isOpen" max-width="400px">
    <v-card>
      <v-card-title>
        Pricing
      </v-card-title>
      <v-card-text class="px-0 pb-0">
        <v-simple-table
          v-for="{ unit, credits } in units"
          class="mb-4"
          outlined
          dense
        >
          <thead>
            <tr>
              <th class="pl-6" width="50%">{{ unit }}</th>
              <th class="pr-6" width="50%">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tier, index) in Object.keys(creditTiers)">
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
                    'AUD',
                    true
                  )
                }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="close" color="accent" text>Close</v-btn>
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
      default: ''
    }
  },
  data() {
    return {
      isOpen: false,
      creditsPerUnit,
      creditTiers,
      units: creditsPerUnit[this.product].units
    }
  },
  methods: {
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false

      this.$emit('close')
    }
  }
}
</script>
