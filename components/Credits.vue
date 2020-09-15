<template>
  <v-card
    v-if="isSignedIn"
    color="secondary"
    :class="variant ? 'mb-4' : ''"
    flat
  >
    <v-card-text :class="variant ? '' : 'pa-2 pl-4'">
      <v-row align="center">
        <v-col
          :class="`py-0 flex-grow-1 flex-shrink-0 ${
            variant ? '' : 'text-right'
          }`"
        >
          Credit balance:
          <template v-if="!variant">
            <Spinner v-if="credits === null" />
            <span v-else class="font-weight-medium">
              {{ formatNumber(credits) }}
            </span>
          </template>
        </v-col>
        <v-col
          class="py-0 text-right font-weight-medium flex-grow-0 flex-shrink-1"
        >
          <template v-if="variant">
            <Spinner v-if="credits === null" />
            <template v-else>
              {{ formatNumber(credits) }}
            </template>
          </template>
          <v-btn
            v-else
            :to="{ path: '/credits', query: { buy: true } }"
            outlined
            small
            >Buy credits</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    Spinner,
  },
  props: {
    variant: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
    }),
  },
  watch: {
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        this.getCredits()
      }
    },
  },
  created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        this.getCredits()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
  },
}
</script>
