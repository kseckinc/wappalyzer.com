<template>
  <Page :title="title" secure>
    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>

    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <v-btn
      v-if="isAdmin"
      :href="`https://dashboard.stripe.com/customers/${user.stripeCustomer}`"
      :disabled="!user.stripeCustomer"
      color="success"
      class="mb-4"
      target="_blank"
      outlined
    >
      Stripe customer
      <v-icon right>{{ mdiOpenInNew }}</v-icon>
    </v-btn>

    <v-card class="mb-4">
      <template v-if="isAdmin">
        <v-card-title>
          Administration
        </v-card-title>

        <v-form ref="form" v-model="valid">
          <v-card-text class="py-0">
            <v-row>
              <v-col class="py-0" cols="12" sm="6">
                <v-text-field v-model="userId" label="User ID" readonly />
              </v-col>
              <v-col class="py-0" cols="12" sm="6">
                <v-text-field
                  v-model="stripeCustomer"
                  label="Stripe customer"
                  required
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="saving"
            color="success"
            text
            @click.prevent="submit(false)"
          >
            <v-icon left>{{ mdiContentSave }}</v-icon> Save</v-btn
          >
        </v-card-actions>

        <v-divider />
      </template>

      <v-card-title>
        Sign in details
      </v-card-title>

      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col class="py-0" cols="12" sm="6">
            <v-card-text class="py-0">
              <v-text-field
                v-model="email"
                :rules="rules.email"
                label="Email address"
                required
              />
            </v-card-text>
          </v-col>
          <v-col class="py-0">
            <v-card-text class="py-0">
              <v-text-field
                v-model="oldPassword"
                :append-icon="showPassword ? mdiEyeOff : mdiEye"
                :type="showPassword ? 'text' : 'password'"
                label="Current password"
                @click:append="() => (showPassword = !showPassword)"
              />

              <v-text-field
                v-model="newPassword"
                :append-icon="showPassword ? mdiEyeOff : mdiEye"
                :type="showPassword ? 'text' : 'password'"
                label="New password (optional)"
                @click:append="() => (showPassword = !showPassword)"
              />
            </v-card-text>
          </v-col>
        </v-row>
      </v-form>

      <v-card-actions>
        <v-spacer />
        <v-btn
          :loading="saving"
          color="accent"
          text
          @click.prevent="submit(false)"
        >
          <v-icon left>{{ mdiContentSave }}</v-icon> Save</v-btn
        >
      </v-card-actions>

      <v-divider />

      <Account @save="accountDetailsSaved" />
    </v-card>

    <v-btn color="error" outlined @click="deleteAccountDialog = true">
      <v-icon left>{{ mdiAccountRemove }}</v-icon>
      Delete account
    </v-btn>

    <v-dialog v-model="changeEmailDialog" width="80%" max-width="400">
      <v-card>
        <v-card-title>
          Email address change
        </v-card-title>
        <v-card-text>
          You will be signed out. You must to verify your new email address to
          sign back in.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="changeEmailDialog = false"
            >Cancel</v-btn
          >
          <v-btn color="accent" text @click="submit(true)">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteAccountDialog" width="80%" max-width="400">
      <v-card>
        <v-card-title>
          Delete account
        </v-card-title>
        <v-card-text>
          Your account will be deleted permanently.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="deleteAccountDialog = false"
            >Cancel</v-btn
          >
          <v-btn :loading="removing" color="error" text @click="remove"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiOpenInNew,
  mdiAccountRemove,
  mdiContentSave,
  mdiEye,
  mdiEyeOff,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Account from '~/components/Account.vue'

export default {
  components: {
    Page,
    Account,
  },
  data() {
    return {
      title: 'Account',
      changeEmailDialog: false,
      deleteAccountDialog: false,
      email: '',
      error: false,
      mdiOpenInNew,
      mdiAccountRemove,
      mdiContentSave,
      mdiEye,
      mdiEyeOff,
      newPassword: '',
      oldPassword: '',
      removing: false,
      stripeCustomer: '',
      rules: {
        email: [(v) => /@/.test(v) || 'Enter a valid email address'],
        required: [(v) => !!v || 'This field is required'],
      },
      saving: false,
      showPassword: false,
      success: false,
      userId: '',
      valid: true,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
    }),
  },
  watch: {
    user() {
      this.fill()
    },
  },
  beforeMount() {
    this.fill()
  },
  methods: {
    ...mapActions({
      saveUser: 'user/save',
      deleteUser: 'user/delete',
      changePassword: 'user/changePassword',
    }),
    async submit(emailChange) {
      this.success = ''
      this.error = ''

      if (this.$refs.form.validate()) {
        if (this.email !== this.user.email && !emailChange) {
          this.changeEmailDialog = true

          return
        }

        this.changeEmailDialog = false
        this.saving = true

        try {
          if (this.newPassword) {
            await this.changePassword({
              oldPassword: this.oldPassword,
              newPassword: this.newPassword,
            })
          }

          await this.saveUser({
            email: this.email,
            stripeCustomer: this.stripeCustomer,
          })

          this.success = 'Your details have been saved'
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }

        this.scrollToTop()

        this.saving = false
      }
    },
    async remove() {
      this.removing = true
      this.error = false

      try {
        await this.deleteUser()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.removing = false
      this.deleteAccountDialog = false

      this.scrollToTop()
    },
    accountDetailsSaved() {
      this.success = 'Your details have been updated'

      this.scrollToTop()
    },
    fill() {
      this.email = this.user.email
      this.stripeCustomer = this.user.stripeCustomer
      this.userId = this.user.sub
    },
  },
}
</script>
