<template>
  <div>
    <Page
      :title="title"
      :head="meta"
      :loading="isLoading || (isSignedIn && loading && !error)"
    >
      <v-alert v-if="error" type="error" class="mt-8" text>
        {{ error }}
      </v-alert>

      <v-card v-if="!error" class="mt-12 mb-4">
        <v-card-title>Websites</v-card-title>
        <v-card-text class="pb-0">
          <p style="max-width: 600px">
            Add the websites you want to monitor here and we'll check them
            daily. As soon as we notice a change we'll alert you with an email.
          </p>
        </v-card-text>
        <v-card-text v-if="!alerts.length" class="pb-0">
          <v-alert color="info" class="mb-0" text>
            You haven't added any websites to monitor yet.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0 pt-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="1">Enabled</th>
                <th>Website</th>
                <th width="20%">Created</th>
                <th width="20%">Last checked</th>
                <th width="1" />
              </tr>
            </thead>

            <tbody>
              <tr v-for="alert in alerts" :key="alert.url">
                <td>
                  <v-switch
                    v-model="alert.enabled"
                    class="ma-0 pa-0 mx-auto"
                    hide-details
                    @change="toggle(alert)"
                  />
                </td>
                <td>
                  <a :href="alert.url" target="_blank">{{ alert.url }}</a>
                  <v-icon small>
                    {{ mdiOpenInNew }}
                  </v-icon>
                </td>
                <td>{{ formatDate(new Date(alert.createdAt * 1000)) }}</td>
                <td>{{ formatDate(new Date(alert.updatedAt * 1000)) }}</td>
                <td width="1">
                  <v-btn
                    icon
                    color="error"
                    @click="
                      removeUrl = alert.url
                      removeDialog = true
                    "
                  >
                    <v-icon>{{ mdiCloseCircle }}</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr />
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="accent"
            text
            @click="isSignedIn ? (createDialog = true) : (signInDialog = true)"
          >
            <v-icon left>
              {{ mdiBullhorn }}
            </v-icon>
            Create alert
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-dialog v-model="createDialog" max-width="400px" eager>
        <v-card>
          <v-card-title> Create alert </v-card-title>
          <v-card-text>
            <v-alert v-if="createError" type="error" text>
              {{ createError }}
            </v-alert>

            <p class="mb-6">
              One alert costs 10 credits per 30 days. You currently have
              {{ formatNumber(credits) }} credits.
            </p>

            <v-form ref="form" @submit.prevent="create">
              <v-text-field
                v-model="url"
                :rules="rules.url"
                label="Website URL"
                placeholder="https://www.example.com"
                hide-details="auto"
                dense
                outlined
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="error" text @click="createDialog = false">
              Cancel
            </v-btn>
            <v-btn
              :disabled="credits < 10"
              :loading="creating"
              color="accent"
              text
              @click="create"
            >
              <v-icon left>
                {{ mdiAlphaCCircle }}
              </v-icon>
              Spend 10 credits
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="removeDialog" max-width="400px" eager>
        <v-card>
          <v-card-title> Delete alert </v-card-title>
          <v-card-text>
            <v-alert v-if="removeError" type="error" text>
              {{ removeError }}
            </v-alert>

            This alert will be deleted.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="removeDialog = false">
              Cancel
            </v-btn>
            <v-btn :loading="removing" color="error" text @click="remove">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="signInDialog" max-width="400px">
        <SignIn mode-continue mode-sign-up />
      </v-dialog>

      <template #footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiOpenInNew,
  mdiCloseCircle,
  mdiBullhorn,
  mdiAlphaCCircle,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import SignIn from '~/components/SignIn.vue'
import { alerts as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Page,
    Logos,
    SignIn,
  },
  data() {
    return {
      title: meta.title,
      alerts: [],
      createDialog: false,
      createError: false,
      creating: false,
      error: false,
      loading: true,
      url: '',
      removeDialog: false,
      removeError: false,
      removing: false,
      removeUrl: '',
      mdiOpenInNew,
      mdiCloseCircle,
      mdiBullhorn,
      mdiAlphaCCircle,
      meta,
      rules: {
        url: [
          (v) => {
            try {
              new URL(v.trim()) // eslint-disable-line no-new

              return true
            } catch (error) {
              return 'Enter a valid URL, e.g. https://www.example.com'
            }
          },
        ],
      },
      signInDialog: false,
      subscribing: false,
    }
  },
  computed: {
    ...mapState({
      isLoading: ({ user }) => user.loading,
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
    }),
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        this.signInDialog = false

        try {
          await this.getCredits()

          //
          ;({ alerts: this.alerts } = (await this.$axios.get('alerts')).data)
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }

        this.loading = false

        if (this.url) {
          this.createDialog = true
        }
      }
    },
  },
  async mounted() {
    ;({ url: this.url } = this.$route.query)

    if (this.url) {
      this.$router.replace({ path: this.$route.path })
    }

    if (this.$store.state.user.isSignedIn) {
      try {
        if (this.signInDialog) {
          this.signInDialog = false
        }

        await this.getCredits()
        ;({ alerts: this.alerts } = (await this.$axios.get('alerts')).data)

        this.loading = false
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      if (this.url) {
        this.createDialog = true
      }
    } else if (this.url) {
      this.signInDialog = true
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
    async create() {
      this.success = false
      this.error = false
      this.createError = false
      this.creating = true

      if (this.$refs.form.validate()) {
        try {
          await this.$axios.put('alerts', {
            url: this.url.trim(),
            enabled: true,
          })

          //
          ;({ alerts: this.alerts } = (await this.$axios.get('alerts')).data)

          this.success = 'The alert has been created'
          this.url = ''

          this.createDialog = false
        } catch (error) {
          this.createError = this.getErrorMessage(error)
        }
      }

      this.creating = false
    },
    async remove() {
      this.success = false
      this.error = false
      this.removeError = false
      this.removing = true

      try {
        await this.$axios.delete(`alerts/${encodeURIComponent(this.removeUrl)}`)

        //
        ;({ alerts: this.alerts } = (await this.$axios.get('alerts')).data)

        this.success = 'The alert has been deleted.'

        this.removeDialog = false
      } catch (error) {
        this.removeError = this.getErrorMessage(error)
      }

      this.removing = false
    },
    async toggle(alert) {
      this.error = false

      try {
        await this.$axios.patch(`alerts/${encodeURIComponent(alert.url)}`, {
          enabled: alert.enabled,
        })
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    },
  },
}
</script>
