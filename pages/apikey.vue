<template>
  <Page :title="title" :loading="loading && !error" secure>
    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <p class="mb-8">
      Your API key provides authorized access to our
      <nuxt-link to="/api">APIs</nuxt-link>.
    </p>

    <div class="mb-4">
      <v-btn href="/docs/api" color="accent" outlined>
        <v-icon left>mdi-book-open-page-variant</v-icon>
        API reference
      </v-btn>
    </div>

    <template v-if="!loading">
      <v-card>
        <v-card-text v-if="!apiKey" class="pb-0">
          <v-alert color="info" class="mb-0" outlined>
            You haven't created an API key yet
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="pb-0">
          <v-text-field
            v-model="apiKey.value"
            :append-icon="showKey ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showKey ? 'text' : 'password'"
            class="apikey__value"
            label=""
            readonly
            hide-details
            dense
            @click:append="() => (showKey = !showKey)"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="!apiKey"
            :loading="creating"
            color="accent"
            text
            @click="create"
            ><v-icon left>mdi-key-plus</v-icon> Create key</v-btn
          >
          <v-btn v-else color="error" text @click="removeDialog = true"
            ><v-icon left>mdi-key-remove</v-icon> Delete key</v-btn
          >
        </v-card-actions>
      </v-card>

      <v-dialog v-model="removeDialog" max-width="400px" eager>
        <v-card>
          <v-card-title>
            Delete key
          </v-card-title>
          <v-card-text>
            <v-alert v-if="removeError" type="error">
              {{ removeError }}
            </v-alert>

            <p>
              Any integrations using this key will stop working.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent" text @click="removeDialog = false"
              >Cancel</v-btn
            >
            <v-btn :loading="removing" color="error" text @click="remove"
              >Ok</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </Page>
</template>

<script>
import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'API key',
      apiKey: null,
      creating: false,
      error: false,
      removeDialog: false,
      removeError: false,
      removing: false,
      showKey: false,
      success: false,
      loading: true,
    }
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          this.apiKey = (await this.$axios.get('apikey')).data

          this.loading = false
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        this.apiKey = (await this.$axios.get('apikey')).data

        this.loading = false
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    async create() {
      this.success = false
      this.error = false
      this.creating = true

      try {
        await this.$axios.put(`apikey`)

        this.apiKey = (await this.$axios.get(`apikey`)).data

        this.success = 'Your API key has been created'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.creating = false
    },
    async remove() {
      this.success = false
      this.error = false
      this.removeError = false
      this.removing = true

      try {
        await this.$axios.delete(`apikey`)

        this.apiKey = (await this.$axios.get(`apikey`)).data

        this.success = 'Your API key has been deleted'

        this.removeDialog = false
      } catch (error) {
        this.removeError = this.getErrorMessage(error)
      }

      this.removing = false
    },
  },
}
</script>

<style>
.apikey__value {
  font-family: monospace;
}
</style>
