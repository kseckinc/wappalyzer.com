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
      <nuxt-link to="/api/"> APIs </nuxt-link>.
    </p>

    <template v-if="!loading">
      <div class="mb-4">
        <v-btn href="/docs/api" depressed>
          <v-icon left>
            {{ mdiBookOpenPageVariant }}
          </v-icon>
          API reference
        </v-btn>
      </div>

      <v-card>
        <v-card-title>API Key</v-card-title>
        <v-card-text class="pb-0">
          <p>Use your API key to make authenticated API calls.</p>

          <template v-if="!apiKey">
            <v-alert color="info" class="mb-0" outlined>
              You haven't created an API key yet
            </v-alert>
          </template>
          <template v-else>
            <v-text-field
              v-model="apiKey.value"
              :append-icon="showKey ? mdiEyeOff : mdiEye"
              :type="showKey ? 'text' : 'password'"
              class="secret__value"
              readonly
              hide-details
              dense
              @click:append="() => (showKey = !showKey)"
            />
          </template>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="!apiKey"
            :loading="creatingKey"
            color="accent"
            text
            @click="createKey"
          >
            <v-icon left>
              {{ mdiKeyPlus }}
            </v-icon>
            Create key
          </v-btn>
          <v-btn v-else color="error" text @click="removeKeyDialog = true">
            <v-icon left>
              {{ mdiKeyRemove }}
            </v-icon>
            Delete key
          </v-btn>
        </v-card-actions>

        <v-divider />

        <v-card-title>Signing secret</v-card-title>
        <v-card-text class="pb-0">
          <p>Use your signing secret to verify callback requests.</p>

          <template v-if="!secret">
            <v-alert color="info" class="mb-0" outlined>
              You haven't created an signing secret yet
            </v-alert>
          </template>
          <template v-else>
            <v-text-field
              v-model="secret"
              :append-icon="showSecret ? mdiEyeOff : mdiEye"
              :type="showSecret ? 'text' : 'password'"
              class="secret__value"
              readonly
              hide-details
              dense
              @click:append="() => (showSecret = !showSecret)"
            />
          </template>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="!secret"
            :loading="creatingSecret"
            color="accent"
            text
            @click="createSecret"
          >
            <v-icon left>
              {{ mdiKeyPlus }}
            </v-icon>
            Create secret
          </v-btn>
          <v-btn v-else color="error" text @click="removeSecretDialog = true">
            <v-icon left>
              {{ mdiKeyRemove }}
            </v-icon>
            Delete secret
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-dialog v-model="removeKeyDialog" max-width="400px" eager>
        <v-card>
          <v-card-title> Delete key </v-card-title>
          <v-card-text class="pb-0">
            <v-alert v-if="removeKeyError" type="error">
              {{ removeKeyError }}
            </v-alert>

            Any integrations using this key will stop working.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="removeKeyDialog = false">
              Cancel
            </v-btn>
            <v-btn :loading="removingKey" color="error" text @click="removeKey">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="removeSecretDialog" max-width="400px" eager>
        <v-card>
          <v-card-title> Delete signing secret </v-card-title>
          <v-card-text class="pb-0">
            <v-alert v-if="removeSecretError" type="error">
              {{ removeSecretError }}
            </v-alert>

            The signing secret will be deleted.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="removeSecretDialog = false">
              Cancel
            </v-btn>
            <v-btn
              :loading="removingSecret"
              color="error"
              text
              @click="removeSecret"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </Page>
</template>

<script>
import {
  mdiBookOpenPageVariant,
  mdiEye,
  mdiEyeOff,
  mdiKeyPlus,
  mdiKeyRemove,
} from '@mdi/js'
import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'API key',
      apiKey: null,
      secret: null,
      creatingKey: false,
      creatingSecret: false,
      error: false,
      mdiBookOpenPageVariant,
      mdiEye,
      mdiEyeOff,
      mdiKeyPlus,
      mdiKeyRemove,
      removeKeyDialog: false,
      removeSecretDialog: false,
      removeKeyError: false,
      removeSecretError: false,
      removingKey: false,
      removingSecret: false,
      showKey: false,
      showSecret: false,
      success: false,
      loading: true,
    }
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          ;({ apiKey: this.apiKey, secret: this.secret } = (
            await this.$axios.get('apikey')
          ).data)

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
        ;({ apiKey: this.apiKey, secret: this.secret } = (
          await this.$axios.get('apikey')
        ).data)

        this.loading = false
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    async createKey() {
      this.success = false
      this.error = false
      this.creatingKey = true

      try {
        await this.$axios.put('apikey')
        ;({ apiKey: this.apiKey, secret: this.secret } = (
          await this.$axios.get('apikey')
        ).data)

        this.success = 'Your API key has been created'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.creatingKey = false
    },
    async removeKey() {
      this.success = false
      this.error = false
      this.removeKeyError = false
      this.removingKey = true

      try {
        await this.$axios.delete('apikey')
        ;({ apiKey: this.apiKey, secret: this.secret } = (
          await this.$axios.get('apikey')
        ).data)

        this.success = 'Your API key has been deleted'

        this.removeKeyDialog = false
      } catch (error) {
        this.removeKeyError = this.getErrorMessage(error)
      }

      this.removingKey = false
    },
    async createSecret() {
      this.success = false
      this.error = false
      this.creatingSecret = true

      try {
        await this.$axios.put('apikey/secret')
        ;({ apiKey: this.apiKey, secret: this.secret } = (
          await this.$axios.get('apikey')
        ).data)

        this.success = 'Your signing secret has been created'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.creatingSecret = false
    },
    async removeSecret() {
      this.success = false
      this.error = false
      this.removeSecretError = false
      this.removingSecret = true

      try {
        await this.$axios.delete('apikey/secret')
        ;({ apiKey: this.apiKey, secret: this.secret } = (
          await this.$axios.get('apikey')
        ).data)

        this.success = 'Your signing secret has been deleted'

        this.removeSecretDialog = false
      } catch (error) {
        this.removeSecretError = this.getErrorMessage(error)
      }

      this.removingSecret = false
    },
  },
}
</script>

<style>
.secret__value input {
  font-family: monospace;
}
</style>
