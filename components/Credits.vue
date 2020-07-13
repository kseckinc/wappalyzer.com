<template>
  <v-card color="secondary" class="mb-4" flat>
    <v-card-title class="subtitle-2">Credit balance</v-card-title>
    <v-card-text>{{ credits }}</v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      credits: ({ credits: { credits } }) => credits
    })
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        await this.getCredits()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  }
}
</script>
