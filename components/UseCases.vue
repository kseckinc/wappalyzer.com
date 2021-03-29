<template>
  <v-row class="mb-8">
    <v-col
      v-for="useCase in useCases"
      :key="useCase.text"
      cols="12"
      sm="6"
      md="3"
    >
      <v-card
        class="d-flex flex-column justify-space-between"
        style="height: 100%"
        color="primary lighten-2"
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
            {{ useCase.buttonText }}
            <v-icon right small>{{ mdiArrowRight }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mdiArrowRight } from '@mdi/js'

export default {
  data() {
    return {
      mdiArrowRight,
      useCases: [
        {
          title: 'Generate sales leads',
          text:
            "Find new prospects by the technologies they use. Discover who's using your software and that of your competitors.",
          buttonText: 'Create a list',
          to: '/lists/',
        },
        {
          title: 'Enrich your own data',
          text:
            'Upload a list of websites to get a report of the technologies in use, such as CMS or ecommerce platforms.',
          buttonText: 'Upload a list',
          to: '/bulk/',
        },
        {
          title: 'Automate with ease',
          text:
            'Get instant access to website technology stacks, contact details and metadata using our highly scalable APIs.',
          buttonText: 'Explore options',
          to: '/api/',
        },
        {
          title: 'Connect to your tools',
          text:
            "See your leads' tech stacks in your CRM, browser, mobile device or email client.",
          buttonText: 'See all apps',
          to: '/download/',
        },
      ],
    }
  },
}
</script>
