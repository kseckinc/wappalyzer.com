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

    <v-row class="mb-4">
      <v-col cols="12" lg="8" class="py-0">
        <p>
          Connect Wappalyzer to
          <a
            href="https://app.hubspot.com/ecosystem/8898653/marketplace/apps/marketing/lead-generation/wappalyzer-by-wappalyzer"
            rel="noopener"
            target="_blank"
            >HubSpot</a
          >
          to see the technology stacks of your leads without leaving your CRM.
        </p>
      </v-col>
    </v-row>

    <div class="mb-4">
      <v-btn to="/docs/integrations/hubspot/" color="accent" outlined>
        <v-icon left>{{ mdiBookOpenPageVariant }}</v-icon>
        Documentation
      </v-btn>
      <v-btn
        href="https://app.hubspot.com/ecosystem/8898653/marketplace/apps/marketing/lead-generation/wappalyzer-by-wappalyzer"
        target="_blank"
        color="accent"
        outlined
      >
        <v-icon left>{{ mdiHubspot }}</v-icon>
        App marketplace
      </v-btn>
    </div>

    <v-card>
      <v-card-title> Integration </v-card-title>
      <v-card-text class="px-0">
        <v-alert
          v-if="!connecting && !eligible"
          color="accent"
          class="mx-4"
          outlined
        >
          <p>
            Please subscribe to an eligible plan to enable this integration.
          </p>

          <v-btn to="/pricing/" color="accent" outlined>
            <v-icon left>{{ mdiCalculator }}</v-icon>
            Plans &amp; pricing</v-btn
          >
        </v-alert>

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
                  :color="hubspotId ? 'success' : ''"
                  outlined
                  small
                >
                  <v-icon v-if="hubspotId" small left>
                    {{ mdiCheck }}
                  </v-icon>
                  {{ hubspotId ? `Connected` : 'Not connected' }}
                </v-chip>
              </td>
            </tr>
            <tr v-if="hubspotId">
              <th>HubSpot account ID</th>
              <td>
                {{ hubspotId }}
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
          href="https://app.hubspot.com/oauth/authorize?scope=contacts&redirect_uri=https://www.wappalyzer.com/integrations/hubspot/&client_id=cac4bea5-5678-444c-902f-24f1d9f5e235"
          color="accent"
          _target="blank"
          :loading="connecting"
          :disabled="!eligible"
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
import {
  mdiCheck,
  mdiClose,
  mdiPowerPlug,
  mdiPowerPlugOff,
  mdiBookOpenPageVariant,
  mdiHubspot,
  mdiCalculator,
} from '@mdi/js'
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
      eligible: false,
      success: null,
      error: null,
      hubspotId: null,
      mdiCheck,
      mdiClose,
      mdiPowerPlug,
      mdiPowerPlugOff,
      mdiBookOpenPageVariant,
      mdiHubspot,
      mdiCalculator,
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
            ;({ eligible: this.eligible, portalId: this.hubspotId } = (
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

    if (this.code) {
      this.$router.replace({
        path: this.$route.path,
      })
    }

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
          ;({ eligible: this.eligible, portalId: this.hubspotId } = (
            await this.$axios.get('hubspot')
          ).data)
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }

      this.connecting = false
    }
  },
  methods: {
    async authenticate() {
      this.success = null
      this.error = null
      this.connecting = true

      try {
        ;({ portalId: this.hubspotId } = (
          await this.$axios.post(`hubspot/auth/${this.code}`)
        ).data)

        this.eligible = true

        this.success = 'Connected to HubSpot.'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.connecting = false
    },
    async disconnect() {
      this.success = null
      this.error = null
      this.disconnecting = true

      try {
        await this.$axios.delete('hubspot')

        this.hubspotId = null

        this.success = 'Disconnected from HubSpot.'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.disconnecting = false
    },
  },
}
</script>
