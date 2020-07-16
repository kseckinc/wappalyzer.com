<template>
  <v-card color="secondary" class="mb-4" flat>
    <v-card-text>
      <v-row>
        <v-col class="py-0" cols="7">
          Credit balance:
        </v-col>
        <v-col class="py-0 text-right font-weight-medium">
          <Spinner v-if="credits === null" />
          <template v-else>
            {{ formatNumber(credits) }}
          </template>
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
