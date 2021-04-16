<template>
  <v-card
    v-if="isSignedIn"
    :color="variant ? 'primary lighten-2' : 'secondary'"
    :class="variant ? 'mb-4' : ''"
    flat
  >
    <v-card-title v-if="variant" class="subtitle-2 primary--text">
      Balances
    </v-card-title>
    <v-card-text v-if="variant">
      <v-row align="center" class="py-2 primary--text">
        <v-col class="py-0">Credits</v-col>
        <v-col class="py-0 text-right">
          <Spinner v-if="credits === null" />
          <template v-else>
            {{ formatNumber(credits) }}
          </template>
        </v-col>
      </v-row>
      <v-row align="center" class="py-2 primary--text">
        <v-col class="py-0">
          Free lists

          <v-tooltip v-if="freeLists.total === 0" max-width="250" right>
            <template #activator="{ on }">
              <sup>
                <v-icon color="primary" small v-on="on">{{
                  mdiHelpCircleOutline
                }}</v-icon>
              </sup>
            </template>

            Free lists are included in selected plans. See the pricing page for
            more information.
          </v-tooltip>
        </v-col>
        <v-col class="py-0 text-right">
          <Spinner v-if="freeLists.total === null" />
          <template v-else>
            <v-tooltip v-if="freeLists.availableAt" max-width="250" top>
              <template #activator="{ on }">
                <sup>
                  <v-icon color="primary" small left v-on="on">{{
                    mdiCalendarBlank
                  }}</v-icon>
                </sup>
              </template>

              Your next free list will be available from
              {{
                formatDate(new Date(freeLists.availableAt * 1000))
              }} </v-tooltip
            >{{ formatNumber(freeLists.remaining) }} /
            {{ formatNumber(freeLists.total) }}
          </template>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else class="py-0 pr-3">
      <v-row align="center">
        <v-col class="py-0 text-right pr-0 flex-grow-1 flex-shrink-0">
          <small>
            Credit balance:
            <Spinner v-if="credits === null" />
            <span v-else class="font-weight-medium">
              {{ formatNumber(credits) }}
            </span>
          </small>
        </v-col>
        <v-col
          class="py-0 pr-0 text-right font-weight-medium flex-grow-0 flex-shrink-1"
        >
          <v-btn
            color="primary"
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
import { mdiCalendarBlank, mdiHelpCircleOutline } from '@mdi/js'

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
  data() {
    return {
      mdiCalendarBlank,
      mdiHelpCircleOutline,
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
      freeLists: ({ credits: { freeLists } }) => freeLists,
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
