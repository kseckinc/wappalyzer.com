<template>
  <Page
    :title="title"
    :crumbs="[{ title: 'Integrations', to: '/integrations/' }]"
    secure
  >
    <v-alert v-if="success" type="success" class="mb-8">
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error" class="mb-8">
      {{ error }}
    </v-alert>

    <v-row class="mb-4">
      <v-col cols="12" lg="8" class="py-0">
        <p>
          Connect Wappalyzer to
          <a
            :href="`https://marketplace.pipedrive.com/app/wappalyzer/${clientId}`"
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
        href="https://marketplace.pipedrive.com/app/wappalyzer/${clientId}"
        target="_blank"
        color="accent"
        outlined
      >
        <v-icon left>{{ mdiStore }}</v-icon>
        Marketplace
      </v-btn>
    </div>

    <v-card>
      <v-card-title>Integration</v-card-title>
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
          :href="`https://oauth.pipedrive.com/oauth/authorize?redirect_uri=${websiteUrl}/integrations/pipedrive/&client_id=${clientId}`"
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

      <template v-if="pipedriveId">
        <v-divider />

        <v-card-title>Configuration</v-card-title>

        <v-card-text>
          <v-text-field
            v-model="orgWebsiteField"
            label="Organisation website field"
            placeholder="API key, e.g. 9a13fd5c052a4820a31d4ce097000d61d098fed1"
            hide-details="auto"
            class="mb-4"
          />

          <p>
            <small>
              In
              <a
                :href="`${user.pipedriveBaseUrl}/settings/fields`"
                target="_blank"
                rel="noopener"
                >Pipedrive settings</a
              >, go to
              <v-chip small>Data fields</v-chip>
              &rarr; <v-chip small>Organization</v-chip> &rarr;
              <v-chip small>Custom fields</v-chip> and create or find a custom
              field that contains the website URL for organisations. Hover over
              the field, click the three-dot menu and copy the API key.
            </small>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" :loading="saving" text @click="save">
            <v-icon left>{{ mdiContentSave }}</v-icon>
            Save</v-btn
          >
        </v-card-actions>
      </template>
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
  mdiContentSave,
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
      orgWebsiteField: null,
      pipedriveId: null,
      saving: false,
      mdiCheck,
      mdiClose,
      mdiPowerPlug,
      mdiPowerPlugOff,
      mdiBookOpenPageVariant,
      mdiStore,
      mdiCalculator,
      mdiContentSave,
      websiteUrl: this.$config.WEBSITE_URL,
      clientId: this.$config.PIPEDRIVE_CLIENT_ID,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
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
          ;({
            eligible: this.eligible,
            id: this.pipedriveId,
            orgWebsiteField: this.orgWebsiteField,
          } = (await this.$axios.get('pipedrive')).data)
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
    async save() {
      this.success = null
      this.error = null
      this.saving = true

      try {
        await this.$axios.patch('pipedrive', {
          orgWebsiteField: this.orgWebsiteField,
        })
        ;({
          eligible: this.eligible,
          id: this.pipedriveId,
          orgWebsiteField: this.orgWebsiteField,
        } = (await this.$axios.get('pipedrive')).data)

        this.success = 'Configuration changes have been saved.'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.saving = false
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
