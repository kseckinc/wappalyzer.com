<template>
  <v-app light>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
    }),
  },
  watch: {
    async isSignedIn(isSignedIn) {
      if (isSignedIn) {
        const impersonating = this.$cookies.get('impersonate')

        if (impersonating) {
          this.signInAs(impersonating)
        } else {
          await Promise.all([this.getOrganisations(), this.getCredits()])
        }
      }
    },
  },
  mounted() {
    this.updateUserAttrs()
  },
  methods: {
    ...mapActions({
      updateUserAttrs: 'user/updateAttrs',
      getOrganisations: 'organisations/get',
    }),
  },
}
</script>
