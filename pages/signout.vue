<template>
  <div>
    <Page :title="title" no-hero no-subscribe>
      <template v-if="success">
        <p>{{ success }}</p>

        <v-btn to="/" color="accent" class="mt-4" outlined
          >Return to home</v-btn
        >
      </template>
      <v-alert v-else-if="error" type="error">
        {{ error }}
      </v-alert>
      <p v-else>Signing out...</p>
    </Page>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Sign out',
      success: '',
      error: '',
      signingOut: false,
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
    }),
  },
  async mounted() {
    if (!this.isSignedIn) {
      this.success = 'You have been signed out.'
    } else {
      this.signingOut = true

      try {
        await this.signOut()

        this.$cookies.remove('impersonate', {
          path: '/',
        })

        this.$cookies.remove('userId', {
          path: '/',
        })

        this.setMemberOf([])

        this.success = 'You have been signed out.'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.signingOut = false
    }
  },
  methods: {
    ...mapActions({
      signOut: 'user/signOut',
      setMemberOf: 'organisations/set',
    }),
  },
}
</script>
