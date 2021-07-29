<template>
  <div>
    <v-row>
      <v-col
        v-for="(useCase, index) in useCases"
        :key="index"
        cols="6"
        :sm="tall ? 6 : 4"
        :md="tall ? 6 : 2"
      >
        <div class="d-flex" style="height: 100%">
          <div style="height: 100%">
            <v-avatar color="primary lighten-1" size="48" class="mb-2">
              <v-icon color="primary" size="24">{{ useCase.icon }}</v-icon>
            </v-avatar>

            <div>
              <div class="subtitle-2 primary--text mb-1">
                {{ useCase.title }}
              </div>

              <div style="line-height: 1rem">
                <small class="text--disabled">
                  {{ useCase.text }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  mdiFileTableOutline,
  mdiAccountMultiple,
  mdiFaceAgent,
  mdiEarth,
  mdiChartBoxOutline,
  mdiIncognito,
  mdiEmailOutline,
  mdiShieldOutline,
  mdiLaptop,
  mdiConsole,
  mdiChartTimelineVariantShimmer,
  mdiBellOutline,
} from '@mdi/js'

export default {
  props: {
    tall: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      useCases: [
        {
          title: 'Website profiling',
          text: 'Find out what websites are built with.',
          icon: mdiEarth,
        },
        {
          title: 'Lead generation',
          text: 'Find prospects by the technologies they use.',
          icon: mdiAccountMultiple,
        },
        {
          title: 'Market research',
          text: 'Compare market shares and technology trends.',
          icon: mdiChartBoxOutline,
        },
        {
          title: 'Competitor analysis',
          text: "Discover who uses competitors' software.",
          icon: mdiIncognito,
        },
        {
          title: 'Data enrichment',
          text: 'Technology, company and contact information.',
          icon: mdiFileTableOutline,
        },
        {
          title: 'Custom reports',
          text: 'Create lists of websites and contacts.',
          icon: mdiChartTimelineVariantShimmer,
        },
        {
          title: 'Website monitoring',
          text: 'Monitor website technology changes.',
          icon: mdiBellOutline,
        },
        {
          title: 'Browser extension',
          text: 'See the technologies on websites you visit.',
          icon: mdiLaptop,
        },
        {
          title: 'CRM integration',
          text: 'See the technologies of your leads.',
          icon: mdiFaceAgent,
        },
        {
          title: 'Email verification',
          text: 'Improve delivery and mailing list quality.',
          icon: mdiEmailOutline,
        },
        {
          title: 'API access',
          text: 'Instant and real-time technology lookups.',
          icon: mdiConsole,
        },
        {
          title: 'Security recon',
          text: 'Reveal web technologies and version numbers.',
          icon: mdiShieldOutline,
        },
      ],
    }
  },
}
</script>
