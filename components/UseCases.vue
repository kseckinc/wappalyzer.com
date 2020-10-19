<template>
  <v-row class="mb-8" justify="center" justify-md="space-between">
    <v-col
      v-for="(useCase, index) in useCases"
      :key="useCase.text"
      align="center"
      cols="6"
      sm="4"
      md="auto"
    >
      <nuxt-link class="primary--text" :to="useCase.to">
        <div class="mb-2">
          <v-avatar
            :color="active === index + 1 ? 'primary' : 'secondary'"
            size="64"
            class="elevation-2"
          >
            <v-icon :color="active === index + 1 ? 'white' : 'primary'" large>{{
              useCase.icon
            }}</v-icon>
          </v-avatar>
        </div>
        <div class="caption font-weight-medium">
          {{ useCase.text }}
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
  props: {
    active: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      useCases: [
        {
          text: 'Lead generation',
          icon: mdiAccountMultiple,
          to: '/lead-generation',
        },
        {
          text: 'Market research',
          icon: mdiChartDonut,
          to: '/market-research',
        },
        {
          text: 'Competitor analysis',
          icon: mdiChartBoxOutline,
          to: '/competitor-analysis',
        },
        {
          text: 'Data enrichment',
          icon: mdiFileTableOutline,
          to: '/data-enrichment',
        },
        {
          text: 'Security recon',
          icon: mdiSecurity,
          to: '/security-recon',
        },
      ],
    }
  },
}
</script>
