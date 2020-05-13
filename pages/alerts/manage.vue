<template>
  <Page :title="title" :loading="loading && !error" secure>
    <v-alert v-if="success" type="success">
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <template v-if="!loading">
      <p>
        Create an alert to get notified via email when a website's technology
        stack changes.
      </p>

      <v-btn
        v-if="!quota"
        to="/alerts"
        class="mb-4"
        color="accent"
        outlined
        exact
      >
        Compare plans
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>

      <v-card>
        <v-card-text v-if="!alerts.length" class="pb-0">
          <v-alert color="info" class="mb-0" outlined>
            You don't have any alerts.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th>Website</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="alert in alerts">
                <td>{{ alert.hostname }}</td>
                <td width="1">
                  <v-btn
                    @click="
                      removeHostname = alert.hostname
                      removeDialog = true
                    "
                    color="error"
                    icon
                    ><v-icon>mdi-close-circle</v-icon></v-btn
                  >
                </td>
              </tr>
              <tr></tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="createDialog = true"
            :disabled="alerts.length >= quota"
            color="accent"
            text
            ><v-icon left>mdi-bullhorn</v-icon> Create alert ({{
              Math.max(0, quota - alerts.length)
            }}
            left)</v-btn
          >
        </v-card-actions>
      </v-card>

      <v-dialog v-model="createDialog" max-width="400px" eager>
        <v-card>
          <v-card-title>
            Create alert
          </v-card-title>
          <v-card-text class="pb-0">
            <v-alert v-if="createError" type="error">
              {{ createError }}
            </v-alert>

            <v-text-field
              v-model="hostname"
              :rules="rules.hostname"
              label="Hostname"
              placeholder="example.com"
              dense
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="createDialog = false" color="error" text
              >Cancel</v-btn
            >
            <v-btn @click="create" :loading="creating" color="accent" text
              >Create</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="removeDialog" max-width="400px" eager>
        <v-card>
          <v-card-title>
            Delete alert
          </v-card-title>
          <v-card-text>
            <v-alert v-if="removeError" type="error">
              {{ removeError }}
            </v-alert>

            This alert will be deleted.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="removeDialog = false" color="accent" text
              >Cancel</v-btn
            >
            <v-btn @click="remove" :loading="removing" color="error" text
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
    Page
  },
  data() {
    return {
      title: 'Alerts',
      alerts: [],
      createDialog: false,
      createError: false,
      creating: false,
      error: false,
      hostname: '',
      loading: true,
      quota: 0,
      removeDialog: false,
      removeError: false,
      removeHostname: '',
      removing: false,
      rules: {
        hostname: [
          (v) => {
            try {
              const { hostname } = new URL(`http://${v.trim()}`)

              if (v.trim() !== hostname.trim()) {
                throw new Error('Invalid hostname')
              }

              return true
            } catch (error) {
              return 'Enter a valid hostname, e.g. example.com'
            }
          }
        ]
      },
      success: false
    }
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          ;({ quota: this.quota, alerts: this.alerts } = (
            await this.$axios.get('alerts')
          ).data)

          this.loading = false
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    }
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        ;({ quota: this.quota, alerts: this.alerts } = (
          await this.$axios.get('alerts')
        ).data)

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
      this.createError = false
      this.creating = true

      try {
        await this.$axios.put('alerts', {
          hostname: this.hostname.trim()
        })
        ;({ quota: this.quota, alerts: this.alerts } = (
          await this.$axios.get('alerts')
        ).data)

        this.success = 'The alert has been created'

        this.createDialog = false
      } catch (error) {
        this.createError = this.getErrorMessage(error)
      }

      this.creating = false
    },
    async remove() {
      this.success = false
      this.error = false
      this.removeError = false
      this.removing = true

      try {
        await this.$axios.delete(`alerts/${this.removeHostname}`)
        ;({ quota: this.quota, alerts: this.alerts } = (
          await this.$axios.get('alerts')
        ).data)

        this.success = 'The alert has been deleted.'

        this.removeDialog = false
      } catch (error) {
        this.removeError = this.getErrorMessage(error)
      }

      this.removing = false
    }
  }
}
</script>
