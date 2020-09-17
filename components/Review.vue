<template>
  <v-card v-if="!removed">
    <v-card-text>
      <p property="reviewBody">
        {{ review.text }}
      </p>

      <div property="reviewRating" typeof="Rating">
        <span property="ratingValue" :content="review.stars">
          <StarRating :stars="review.stars" />
        </span>
      </div>

      <div property="publisher" typeof="Person" class="caption">
        <span property="name" class="font-weight-medium">
          {{ review.name }}
        </span>
        - {{ formatDate(new Date(review.createdAt * 1000)) }}
      </div>
    </v-card-text>
    <v-card-actions
      v-if="isSignedIn && user.sub === review.userId"
      class="pt-0"
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
          stars: 0,
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
    }),
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
