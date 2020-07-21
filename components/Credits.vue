<template>
  <v-card
    :color="variant ? 'secondary' : ''"
    :outlined="!variant"
    class="mb-4"
    flat
  >
    <v-card-text :class="variant ? '' : 'pa-2 pl-4'">
      <v-row align="center">
        <v-col class="py-0" cols="7">
          Credit balance:
          <template v-if="!variant">
            <Spinner v-if="credits === null" />
            <span v-else class="font-weight-medium">
              {{ formatNumber(credits) }}
            </span>
          </template>
        </v-col>
        <v-col class="py-0 text-right font-weight-medium">
          <template v-if="variant">
            <Spinner v-if="credits === null" />
            <template v-else>
              {{ formatNumber(credits) }}
            </template>
          </template>
          <v-btn v-else to="/credits" text>Buy credits</v-btn>
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
    Spinner
  },
  props: {
    variant: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      credits: ({ credits: { credits } }) => credits
    })
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
      getCredits: 'credits/get'
    })
  }
}
</script>
