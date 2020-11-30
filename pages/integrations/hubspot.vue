<template>
  <Page
    :title="title"
    :crumbs="[{ title: 'Integrations', to: '/integrations/' }]"
    secure
  >
    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <v-card>
      <v-card-title>
        Connection
      </v-card-title>
      <v-card-text class="px-0">
        <v-simple-table>
          <tbody>
            <tr>
              <th width="30%">Status</th>
              <td>
                <template v-if="connecting">
                  <Spinner />
                </template>
                <v-chip
                  v-else
                  :color="hubspotId ? 'success' : 'error'"
                  outlined
                  small
                >
                  <v-icon small left>
                    {{ hubspotId ? mdiCheck : mdiClose }}
                  </v-icon>
                  {{ hubspotId ? `Connected (${hubspotId})` : 'Not connected' }}
                </v-chip>
              </td>
            </tr>

            <tr></tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="!hubspotId"
          href="https://app.hubspot.com/oauth/authorize?scope=contacts&redirect_uri=http://localhost:3000/integrations/hubspot/&client_id=cac4bea5-5678-444c-902f-24f1d9f5e235"
          color="accent"
          _target="blank"
          :loading="connecting"
          text
        >
          <v-icon left>{{ mdiPowerPlug }}</v-icon>
          Connect</v-btn
        >
        <v-btn
          v-else
          color="error"
          :loading="disconnecting"
          text
          @click="disconnect"
        >
          <v-icon left>{{ mdiPowerPlugOff }}</v-icon>
          Disconnect</v-btn
        >
      </v-card-actions>
    </v-card>
  </Page>
</template>

<script>
import { mdiCheck, mdiClose, mdiPowerPlug, mdiPowerPlugOff } from '@mdi/js'
import { mapState } from 'vuex'

import Page from '~/components/Page.vue'
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    Page,
    Spinner,
  },
  data() {
    return {
      title: 'HubSpot',
      code: null,
      connecting: false,
      disconnecting: false,
      success: null,
      error: null,
      hubspotId: null,
      mdiCheck,
      mdiClose,
      mdiPowerPlug,
      mdiPowerPlugOff,
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
    }),
  },
  watch: {
    async isSignedIn() {
      if (this.isSignedIn) {
        this.connecting = true

        if (this.code) {
          try {
            await this.authenticate()
          } catch (error) {
            this.error = this.getErrorMessage(error)
          }
        } else {
          try {
            ;({ portalId: this.hubspotId } = (
              await this.$axios.get('hubspot')
            ).data)
          } catch (error) {
            // Continue
          }
        }

        this.connecting = false
      }
    },
  },
  async mounted() {
    const { code } = this.$route.query

    this.code = code

    if (this.isSignedIn) {
      this.connecting = true

      if (this.code) {
        try {
          await this.authenticate()
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      } else {
        try {
          ;({ portalId: this.hubspotId } = (
            await this.$axios.get('hubspot')
          ).data)
        } catch (error) {
          // Continue
        }
      }

      this.connecting = false
    }
  },
  methods: {
    async authenticate() {
      this.connecting = true

      try {
        ;({ portalId: this.hubspotId } = (
          await this.$axios.post(`hubspot/auth/${this.code}`)
        ).data)
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.connecting = false
    },
    async disconnect() {
      this.disconnecting = true

      try {
        await this.$axios.delete('hubspot')

        this.hubspotId = null
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.disconnecting = false
    },
  },
}
</script>
