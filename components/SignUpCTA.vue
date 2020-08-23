<template>
  <div>
    <div v-if="!$store.state.user.isSignedIn">
      <v-divider class="mb-12" />

      <v-container class="logos text-center mb-10">
        <p class="body-2 mb-8">
          Sign up for a free account to access to all tools and products.
        </p>

        <v-btn color="primary" class="mb-2" x-large @click="signUpDialog = true"
          ><v-icon left>mdi-account-plus</v-icon> Sign up for free</v-btn
        >

        <v-dialog v-model="signUpDialog" max-width="400px">
          <SignIn mode-sign-up />
        </v-dialog>
      </v-container>
    </div>

    <v-dialog v-model="signedInDialog" max-width="400px">
      <v-card>
        <v-card-title>
          Signed in
        </v-card-title>
        <v-card-text class="pb-0">
          You are now signed in.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn to="/account" color="accent" text>Manage account</v-btn>
          <v-btn color="accent" text @click="signedInDialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import SignIn from '~/components/SignIn.vue'

export default {
  components: {
    SignIn,
  },
  data() {
    return {
      signUpDialog: false,
      signedInDialog: false,
    }
  },
  watch: {
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn && this.signUpDialog) {
        this.signUpDialog = false
        this.signedInDialog = true
      }
    },
  },
}
</script>
