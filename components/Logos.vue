<template>
  <div>
    <v-divider class="mb-12" />

    <v-container class="logos text-center mb-6">
      <p class="overline font-weight-regular">
        Wappalyzer is trusted by thousands of professionals world-wide
      </p>

      <v-row align="center">
        <v-col v-for="logo in logos" :key="logo" sm="2" lg="1">
          <v-img
            :src="`/images/logos/${logo}.svg`"
            class="mx-auto"
            max-width="100"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logos: [
        'Google',
        'Oracle',
        'Amazon',
        'IBM',
        'PayPal',
        'Ebay',
        'Shopify',
        'Stripe',
        'SAP',
        'Microsoft',
        'Salesforce',
        'Adobe',
      ],
    }
  },
}
</script>

<style>
.logos .v-image {
  opacity: 0.5;
}
</style>
