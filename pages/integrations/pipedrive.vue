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
            href="https://marketplace.pipedrive.com/app/wappalyzer/c13f52b93ab427e3"
            rel="noopener"
            target="_blank"
            >Pipedrive</a
          >
          to see the technology stacks of your leads without leaving your CRM.
        </p>
      </v-col>
    </v-row>

    <div class="mb-4">
      <v-btn to="/docs/integrations/pipedrive/" color="accent" outlined>
        <v-icon left>{{ mdiBookOpenPageVariant }}</v-icon>
        Documentation
      </v-btn>
      <v-btn
        href="https://marketplace.pipedrive.com/app/wappalyzer/c13f52b93ab427e3"
        target="_blank"
        color="accent"
        outlined
      >
        <v-icon left>{{ mdiStore }}</v-icon>
        Marketplace
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
                  :color="pipedriveId ? 'success' : ''"
                  outlined
                  small
                >
                  <v-icon v-if="pipedriveId" small left>
                    {{ mdiCheck }}
                  </v-icon>
                  {{ pipedriveId ? `Connected` : 'Not connected' }}
                </v-chip>
              </td>
            </tr>
            <tr v-if="pipedriveId">
              <th>Pipedrive account ID</th>
              <td>
                {{ pipedriveId }}
              </td>
            </tr>

            <tr></tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="!pipedriveId"
          href="https://oauth.pipedrive.com/oauth/authorize?redirect_uri=https://www.wappalyzer.com/integrations/pipedrive/&client_id=c13f52b93ab427e3"
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
  mdiStore,
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
      title: 'Pipedrive',
      code: null,
      connecting: false,
      disconnecting: false,
      eligible: false,
      success: null,
      error: null,
      pipedriveId: null,
      mdiCheck,
      mdiClose,
      mdiPowerPlug,
      mdiPowerPlugOff,
      mdiBookOpenPageVariant,
      mdiStore,
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
            ;({ eligible: this.eligible, id: this.pipedriveId } = (
              await this.$axios.get('pipedrive')
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
          ;({ eligible: this.eligible, id: this.pipedriveId } = (
            await this.$axios.get('pipedrive')
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
        ;({ id: this.pipedriveId } = (
          await this.$axios.post(`pipedrive/auth/${this.code}`)
        ).data)

        this.eligible = true

        this.success = 'Connected to Pipedrive.'
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
        await this.$axios.delete('pipedrive')

        this.pipedriveId = null

        this.success = 'Disconnected from Pipedrive.'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.disconnecting = false
    },
  },
}
</script>
