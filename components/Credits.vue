<template>
  <v-card color="secondary" class="mb-4" flat>
    <v-card-title class="subtitle-2">Credit balance</v-card-title>
    <v-card-text>{{ formatNumber(credits) }}</v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
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
