<template>
  <Page :title="title" :loading="loading && !error" secure>
    <v-alert v-if="error" type="error" text>
      {{ error }}
    </v-alert>

    <template v-if="!loading">
      <div class="mb-4">
        <v-btn href="/technologies/" depressed>
          <v-icon left>
            {{ mdiMagnify }}
          </v-icon>
          Browse technologies
        </v-btn>
      </div>

      <template v-if="reviews.length">
        <div v-for="(review, index) in reviews" :key="index">
          <h3 class="mb-2 subtitle-2">
            <nuxt-link
              :to="`/technologies/${
                review.technology.categories.length
                  ? `${review.technology.categories[0].slug}/`
                  : ''
              }${review.technology.slug}/`"
              class="d-flex align-center mb-4"
            >
              <TechnologyIcon :icon="review.technology.icon" />
              {{ review.technology.name }}
            </nuxt-link>
          </h3>

          <Review :key="index" :review="review" class="mb-8" />
        </div>
      </template>
      <v-alert v-else class="ma-0" color="info" text>
        You haven't written any reviews.
      </v-alert>
    </template>
  </Page>
</template>

<script>
import { mdiMagnify } from '@mdi/js'

import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Review from '~/components/Review.vue'

export default {
  components: {
    Page,
    TechnologyIcon,
    Review,
  },
  data() {
    return {
      title: 'Reviews',
      error: false,
      loading: true,
      mdiMagnify,
      reviews: [],
    }
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          this.reviews = (await this.$axios.get('reviews')).data

          this.loading = false
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
  },
  async mounted() {
    if (this.$store.state.user.isSignedIn) {
      try {
        this.reviews = (await this.$axios.get('reviews')).data

        this.loading = false
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
}
</script>
