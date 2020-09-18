<template>
  <v-card v-if="!removed">
    <v-card-text>
      <p property="reviewBody">
        <span style="white-space: pre-line;">{{ formattedText }}</span>
      </p>

      <div property="reviewRating" typeof="Rating">
        <span property="ratingValue" :content="review.rating">
          <StarRating :stars="review.rating" />
        </span>
      </div>

      <div property="publisher" typeof="Person" class="caption">
        <span property="name" class="font-weight-medium">
          {{ review.name || 'Anonymous' }}
        </span>
        - {{ formatDate(new Date(review.createdAt * 1000)) }}
      </div>
    </v-card-text>
    <v-card-actions
      v-if="isSignedIn && (isAdmin || user.sub === review.userId)"
      class="pt-0 mt-n2"
    >
      <v-spacer />
      <v-btn :loading="removing" color="error" text small @click="remove"
        ><v-icon left>{{ mdiDelete }}</v-icon
        >Delete</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import { mdiDelete } from '@mdi/js'

import StarRating from '~/components/StarRating.vue'

export default {
  components: {
    StarRating,
  },
  props: {
    review: {
      type: Object,
      default() {
        return {
          name: 'Anonymous',
          text: '',
          rating: 0,
          createdAt: Date.now() / 1000,
          userId: '',
        }
      },
    },
  },
  data() {
    return {
      mdiDelete,
      removing: false,
      removed: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
      isAdmin: ({ user }) => user.attrs.admin || user.impersonating,
    }),
    formattedText() {
      return this.review.text
        .replace(/\n\n+/g, '\n\n')
        .replace(/[^\S\r\n]+/g, ' ')
        .trim()
    },
  },
  methods: {
    async remove() {
      this.removing = true

      try {
        await this.$axios.delete(
          `reviews/${this.review.slug}/${this.review.userId}`
        )

        this.removed = true
      } catch (error) {
        // Do nothing
      }

      this.removing = false
    },
  },
}
</script>
