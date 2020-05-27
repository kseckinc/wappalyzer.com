<template>
  <v-card class="mx-auto" width="400">
    <v-card-title v-if="mode === 'signIn' || mode === 'verifySignIn'">
      Sign in {{ modeContinue ? 'to continue' : '' }}
    </v-card-title>
    <v-card-title v-if="mode === 'signUp' || mode === 'verifySignUp'">
      Sign up {{ modeContinue ? 'to continue' : '' }}
    </v-card-title>
    <v-card-title v-if="mode === 'reset' || mode === 'verifyReset'">
      Reset password
    </v-card-title>
    <v-card-text v-if="!isSignedIn">
      <v-alert v-if="success" outlined type="success">
        {{ success }}
      </v-alert>
      <v-alert v-if="error" outlined type="error">
        {{ error }}
      </v-alert>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-if="mode !== 'verifySignUp' && mode !== 'verifySignIn'"
          v-model="email"
          :rules="emailRules"
          label="Email address"
          class="mb-4"
          required
        />

        <v-text-field
          v-if="
            mode !== 'reset' &&
              mode !== 'verifySignUp' &&
              mode !== 'verifySignIn'
          "
          v-model="password"
          @click:append="() => (showPassword = !showPassword)"
          :rules="passwordRules"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          :label="mode === 'verifyReset' ? 'New password' : 'Password'"
          class="mt-n4 mb-4"
          required
        />

        <v-checkbox
          v-if="mode === 'signUp'"
          v-model="subscribe"
          label="Receive occasional product updates"
        />

        <v-text-field
          v-if="
            mode === 'verifyReset' ||
              mode === 'verifySignUp' ||
              mode === 'verifySignIn'
          "
          v-model="code"
          :rules="codeRules"
          label="Verification code"
          class="mb-4"
          required
        />

        <template v-if="mode === 'signUp'">
          <v-btn
            @click.prevent.stop="doSignUp"
            :disabled="!valid"
            :loading="signingUp"
            type="submit"
            color="primary"
            large
          >
            Sign up
          </v-btn>

          <div class="mt-4">
            <a @click.prevent="mode = 'signIn'" href="">
              Already have an account?
            </a>
          </div>
        </template>
        <template v-else-if="mode === 'signIn'">
          <v-btn
            @click.prevent.stop="doSignIn"
            :disabled="!valid"
            :loading="signingIn"
            type="submit"
            color="primary"
            large
          >
            Sign in
          </v-btn>

          <div class="mt-4">
            <a @click.prevent="mode = 'signUp'">
              Create an account
            </a>
            <br />
            <a @click.prevent="mode = 'reset'">
              Reset password
            </a>
          </div>
        </template>
        <template
          v-else-if="
            mode === 'reset' ||
              mode === 'verifySignUp' ||
              mode === 'verifySignIn'
          "
        >
          <v-btn
            @click.prevent.stop="
              () => (mode === 'reset' ? doReset() : doVerify())
            "
            :disabled="!valid"
            :loading="verifying"
            type="submit"
            color="primary"
            large
          >
            Verify
          </v-btn>

          <v-btn
            v-if="mode !== 'reset'"
            @click.prevent.stop="doReverify"
            :loading="reverifying"
            text
            large
          >
            Resend code
          </v-btn>

          <div class="mt-4">
            <a
              v-if="mode !== 'verifySignUp' && mode !== 'verifySignIn'"
              @click.prevent="mode = 'signIn'"
            >
              Sign in
            </a>
          </div>
        </template>
        <template v-else-if="mode === 'verifyReset'">
          <v-btn
            @click.prevent.stop="doVerify"
            :disabled="!valid"
            :loading="resetting"
            type="submit"
            color="primary"
            large
          >
            Reset password
          </v-btn>

          <div class="mt-4">
            <a @click.prevent="mode = 'signIn'">
              Sign in
            </a>
          </div>
        </template>
      </v-form>
    </v-card-text>
    <v-card-text v-else>
      <p>
        You are signed in.
      </p>

      <v-btn @click.stop="doSignOut" :loading="signingOut" color="primary" nuxt>
        Sign out
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    modeSignUp: {
      type: Boolean,
      default: false
    },
    modeReset: {
      type: Boolean,
      default: false
    },
    modeContinue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mode: this.modeSignUp ? 'signUp' : this.modeReset ? 'reset' : 'signIn',
      error: '',
      nextError: '',
      subscribe: false,
      success: '',
      nextSuccess: '',
      showPassword: false,
      signingIn: false,
      signingUp: false,
      signingOut: false,
      verifying: false,
      reverifying: false,
      resetting: false,
      valid: false,
      email: '',
      emailRules: [
        (v) => !!v || 'Email address is required',
        (v) => /@/.test(v) || 'Email address is invalid'
      ],
      code: '',
      codeRules: [(v) => !!v || 'Code is required'],
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => v.length >= 8 || 'Please enter 8 or more characters'
      ]
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      user: ({ user }) => user.attrs
    })
  },
  watch: {
    mode() {
      this.$refs.form.resetValidation()

      this.success = this.nextSuccess
      this.error = this.nextError

      this.nextSuccess = ''
      this.nextError = ''
    }
  },
  methods: {
    ...mapActions({
      signIn: 'user/signIn',
      signUp: 'user/signUp',
      signOut: 'user/signOut',
      verifyReset: 'user/verifyReset',
      verifySignIn: 'user/verifySignIn',
      reverifySignIn: 'user/reverifySignIn',
      verifySignUp: 'user/verifySignUp',
      reverifySignUp: 'user/reverifySignUp',
      reset: 'user/reset'
    }),
    async doSignIn() {
      this.success = ''
      this.error = ''

      if (this.$refs.form.validate()) {
        this.signingIn = true

        try {
          await this.signIn({ username: this.email, password: this.password })

          if (this.user.email_verified !== 'true') {
            this.mode = 'verifySignIn'
          }
        } catch (error) {
          if (error.code === 'UserNotConfirmedException') {
            try {
              this.mode = 'verifySignUp'
            } catch (error) {
              this.error = error.message || error.toString()
            }
          } else {
            this.error = error.message || error.toString()
          }
        }

        this.signingIn = false
      }
    },
    async doSignUp() {
      this.success = ''
      this.error = ''

      if (this.$refs.form.validate()) {
        this.verifying = true

        if (this.subscribe) {
          try {
            await this.$axios.put(`subscribers/${this.email}`)
          } catch (error) {
            // Do nothing
          }
        }

        try {
          await this.signUp({ username: this.email, password: this.password })

          this.mode = 'verifySignUp'
          this.nextSuccess = 'Please check your email for a verification code'
        } catch (error) {
          this.error = error.message || error.toString()
        }

        this.verifying = false
      }
    },
    async doSignOut() {
      this.success = ''
      this.error = ''
      this.signingOut = true

      try {
        await this.signOut()

        this.success = 'You have been signed out'
      } catch (error) {
        this.error = error.message || error.toString()
      }

      this.signingOut = false
    },
    async doReset() {
      this.success = ''
      this.error = ''

      if (this.$refs.form.validate()) {
        this.verifying = true

        try {
          await this.reset({ username: this.email })

          this.mode = 'verifyReset'
          this.nextSuccess = 'Please check your email for a verication code'
        } catch (error) {
          this.error = error.message || error.toString()
        }

        this.verifying = false
      }
    },
    async doVerify() {
      this.success = ''
      this.error = ''

      if (this.$refs.form.validate()) {
        this.resetting = true

        try {
          if (this.mode === 'verifyReset') {
            await this.verifyReset({
              username: this.email,
              password: this.password,
              code: this.code
            })

            this.mode = 'signIn'
            this.nextSuccess = 'Your password has been reset'
          } else if (this.mode === 'verifySignUp') {
            await this.verifySignUp({
              username: this.email,
              code: this.code
            })

            this.mode = 'signIn'
            this.nextSuccess = 'Thank you for signing up! You can now sign in.'
          } else if (this.mode === 'verifySignIn') {
            await this.verifySignIn({
              code: this.code
            })
          }
        } catch (error) {
          this.error = error.message || error.toString()
        }

        this.resetting = false
      }
    },
    async doReverify() {
      this.reverifying = true
      this.success = ''
      this.error = ''

      try {
        if (this.mode === 'verifySignIn') {
          await this.reverifySignIn({ username: this.email })
        } else if (this.mode === 'verifySignUp') {
          await this.reverifySignUp({ username: this.email })
        }

        this.success = 'Please check your email for a verification code'
      } catch (error) {
        this.error = error.message || error.toString()
      }

      this.reverifying = false
    }
  }
}
</script>
