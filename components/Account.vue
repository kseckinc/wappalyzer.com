<template>
  <v-form ref="form" v-model="valid" class="ml-0 mr-0" style="overflow: hidden">
    <v-alert v-if="error" type="error" class="mt-4 mx-4 mb-0" text>
      {{ error }}
    </v-alert>

    <v-row class="ml-0 mr-0">
      <v-col class="px-0" cols="12" sm="12" lg="6">
        <v-card-title> Personal details </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="attrs.name"
            :rules="rules.required"
            label="Name"
            required
          />

          <v-select
            v-model="attrs.industry"
            :items="industries"
            :rules="rules.required"
            label="Industry"
            required
          />

          <v-select
            v-model="attrs.useCase"
            :items="useCases"
            :rules="rules.required"
            label="Primary use case"
            required
          />

          <v-alert
            v-if="attrs.useCase === 'Reselling'"
            color="warning"
            class="mb-0"
            border="left"
            dense
            text
          >
            <small
              >Our
              <nuxt-link class="warning--text" to="/terms/"
                >Terms of service</nuxt-link
              >
              prohibit reselling without our consent. Please
              <nuxt-link class="warning--text" to="/terms/"
                >contact us</nuxt-link
              >
              to help us understand your use case.
            </small>
          </v-alert>
        </v-card-text>
      </v-col>
      <v-col class="px-0" cols="12" sm="12" lg="6">
        <v-divider class="mt-n4 d-md-block d-lg-none" />

        <v-card-title>Billing details</v-card-title>

        <v-card-text class="py-0">
          <v-text-field
            v-model="attrs.billingName"
            :rules="rules.required"
            label="Name or business name"
            required
          />

          <v-text-field
            v-model="attrs.billingEmail"
            :rules="rules.email"
            label="Email address"
            required
          />

          <v-row>
            <v-col cols="6">
              <v-select
                v-model="attrs.billingTaxIdType"
                :items="taxIds"
                label="Tax ID type"
                required
              />
            </v-col>
            <v-col>
              <v-text-field v-model="attrs.billingTaxId" label="Tax ID" />
            </v-col>
          </v-row>

          <v-select
            v-model="attrs.billingCountry"
            :items="countries"
            :rules="rules.required"
            label="Country"
            required
          />

          <v-alert
            v-if="
              attrs.billingCountry &&
              attrs.billingCountry.toUpperCase() === 'AU'
            "
            color="warning"
            border="left"
            dense
            text
          >
            <small>
              To comply with Spam Act 2003, we exclude email addresses and phone
              numbers in data we sell to Australian customers.
            </small>
          </v-alert>

          <v-text-field
            v-model="attrs.billingAddress1"
            :rules="rules.required"
            label="Address line 1"
            required
          />

          <v-text-field
            v-model="attrs.billingAddress2"
            label="Address line 2"
          />

          <v-text-field
            v-model="attrs.billingCity"
            :rules="rules.required"
            label="City, suburb or town"
            required
          />

          <v-text-field
            v-model="attrs.billingPostcode"
            :rules="rules.required"
            label="Postcode or ZIP"
            required
          />

          <v-select
            v-if="states"
            v-model="attrs.billingState"
            :items="states"
            :rules="rules.required"
            label="State"
            required
          />
          <v-text-field
            v-else
            v-model="attrs.billingState"
            :rules="rules.required"
            label="State, county or province"
            required
          />
        </v-card-text>
      </v-col>
    </v-row>

    <v-card-actions>
      <v-spacer />
      <v-btn
        :loading="saving"
        color="accent"
        text
        @click.prevent="submit(false)"
      >
        <v-icon left>
          {{ mdiContentSave }}
        </v-icon>
        Save
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mdiContentSave } from '@mdi/js'

import taxIds from '~/assets/json/taxids'
import countries from '~/assets/json/countries'
import states from '~/assets/json/states'
import industries from '~/assets/json/industries'
import useCases from '~/assets/json/usecases'

export default {
  data() {
    return {
      title: 'Account',
      attrs: {
        name: '',
        industry: '',
        useCase: '',
        billingEmail: '',
        billingName: '',
        billingTaxId: '',
        billingTaxIdType: '',
        billingAddress1: '',
        billingAddress2: '',
        billingCity: '',
        billingPostcode: '',
        billingState: '',
        billingCountry: '',
      },
      countries,
      error: false,
      industries,
      rules: {
        required: [(v) => !!v || 'This field is required'],
        email: [(v) => /@/.test(v) || 'Enter a valid email address'],
      },
      mdiContentSave,
      saving: false,
      success: false,
      taxIds,
      useCases,
      valid: true,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
    }),
    states() {
      return states[this.attrs.billingCountry] || null
    },
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
      save: 'user/save',
    }),
    async submit() {
      this.success = ''
      this.error = ''

      if (this.$refs.form.validate()) {
        this.saving = true

        try {
          if (this.newPassword) {
            await this.changePassword({
              oldPassword: this.oldPassword,
              newPassword: this.newPassword,
            })
          }

          await this.save(this.attrs)

          this.$emit('save')
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }

        this.saving = false
      }
    },
    fill() {
      Object.keys(this.attrs).forEach(
        (attr) => (this.attrs[attr] = this.user[attr])
      )
    },
  },
}
</script>
