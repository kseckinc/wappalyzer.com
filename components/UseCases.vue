<template>
  <v-row class="mb-8">
    <v-col v-for="useCase in useCases" :key="useCase.text" cols="12" sm="4">
      <v-card
        class="d-flex flex-column justify-space-between"
        style="height: 100%"
        color="primary lighten-1"
        flat
      >
        <v-card-text class="subtitle-2 primary--text">
          <span style="font-size: 1rem">
            {{ useCase.title }}
          </span>
        </v-card-text>
        <v-card-text class="pt-0 primary--text" style="opacity: 0.8">
          {{ useCase.text }}
        </v-card-text>
        <v-spacer />
        <v-card-actions>
          <v-spacer />
          <v-btn :to="useCase.to" color="primary" text>
            <v-icon left>
              {{ useCase.icon }}
            </v-icon>
            {{ useCase.buttonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mdiFilterVariant, mdiApps, mdiFileOutline } from '@mdi/js'

export default {
  data() {
    return {
      useCases: [
        {
          title: 'Generate sales leads',
          text: 'Find new prospects by the technologies they use. Reach out to customers of Shopify, Magento, Salesforce and others.',
          buttonText: 'Create a list',
          icon: mdiFilterVariant,
          to: '/lists/',
        },
        {
          title: 'Enrich your data',
          text: 'Upload a list of websites to get a report of the technologies in use, such as CMS or ecommerce platforms.',
          buttonText: 'Upload a list',
          icon: mdiFileOutline,
          to: { path: '/lookup/', hash: '#bulk' },
        },
        {
          title: 'Connect to your tools',
          text: 'See the technology stacks of your leads in your browser, CRM, mobile device or email client.',
          buttonText: 'See all apps',
          icon: mdiApps,
          to: '/apps/',
        },
      ],
    }
  },
}
</script>
