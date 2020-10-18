<template>
  <v-row class="mb-8" justify="center" justify-md="space-between">
    <v-col
      v-for="feature in features"
      :key="feature.text"
      align="center"
      cols="6"
      sm="4"
      md="auto"
    >
      <nuxt-link class="primary--text" :to="feature.to">
        <div class="mb-2">
          <v-avatar color="secondary" size="64" class="elevation-2">
            <v-icon color="primary" large>{{ feature.icon }}</v-icon>
          </v-avatar>
        </div>
        <div class="caption font-weight-medium">
          {{ feature.text }}
        </div>
      </nuxt-link>
    </v-col>
  </v-row>
</template>

<script>
import {
  mdiFileTableOutline,
  mdiAccountMultiple,
  mdiChartBoxOutline,
  mdiSecurity,
  mdiChartDonut,
} from '@mdi/js'

export default {
  data() {
    return {
      features: [
        {
          text: 'Lead generation',
          icon: mdiAccountMultiple,
          to: '/use-cases#lead-generation',
        },
        {
          text: 'Market research',
          icon: mdiChartDonut,
          to: '/use-cases/#market-research',
        },
        {
          text: 'Competitor analysis',
          icon: mdiChartBoxOutline,
          to: '/use-cases/#competitor-analysis',
        },
        {
          text: 'Data enrichment',
          icon: mdiFileTableOutline,
          to: '/use-cases/#data-enrichment',
        },
        {
          text: 'Security recon',
          icon: mdiSecurity,
          to: '/use-cases/#security-recon',
        },
      ],
    }
  },
}
</script>
