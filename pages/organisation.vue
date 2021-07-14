<template>
  <Page :title="title" :loading="loading && !error" secure>
    <v-alert v-if="success" type="success" text>
      {{ success }}
    </v-alert>

    <v-alert v-if="error" type="error" text>
      {{ error }}
    </v-alert>

    <v-card>
      <v-tabs
        v-model="tab"
        slider-color="primary"
        background-color="secondary"
        active-class="primary--text"
      >
        <v-tab><small>Manage</small></v-tab>
        <v-tab><small>Memberships</small></v-tab>
      </v-tabs>

      <v-divider />

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card flat>
            <v-card-title>
              <v-row>
                <v-col
                  class="flex-shrink-1 flex-grow-0"
                  style="white-space: nowrap"
                >
                  Members
                </v-col>
                <v-col class="text-right flex-shrink-0 flex-grow-1">
                  <small class="body-2 mr-4"
                    >{{ organisation.seatsRemaining }} of
                    {{ organisation.seats }} seats remaining</small
                  >
                  <v-btn
                    :disabled="!organisation.seatsRemaining"
                    color="primary lighten-1"
                    class="primary--text"
                    depressed
                    small
                    @click="createDialog = true"
                  >
                    <v-icon left>
                      {{ mdiAccountPlus }}
                    </v-icon>
                    Add member
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="pb-0">
              <p>
                Members have
                <a @click="accessDialog = true">limited access</a> to your
                account. They can create orders and spend credits.
              </p>

              <p class="mb-0">
                Additional seats are included with selected
                <nuxt-link to="/pricing/">plans</nuxt-link>.
              </p>
            </v-card-text>
            <v-card-text v-if="!organisation.members.length">
              <v-alert class="ma-0" color="info" text>
                This organisation doesn't have any members.
              </v-alert>
            </v-card-text>
            <v-card-text v-else class="px-0">
              <v-simple-table>
                <thead>
                  <tr>
                    <th width="1">Enabled</th>
                    <th>Name</th>
                    <th>Email address</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="member in organisation.members"
                    :key="member.user.sub"
                  >
                    <td>
                      <v-switch
                        v-model="member.enabled"
                        :disabled="
                          !member.enabled && !organisation.seatsRemaining
                        "
                        :loading="member.loading"
                        class="ma-0 pa-0 mx-auto"
                        hide-details
                        @change="toggle(member)"
                      />
                    </td>
                    <td>
                      <template v-if="member.user.name">
                        {{ member.user.name }}
                      </template>
                      <span v-else class="text--disabled">Not provided</span>
                    </td>
                    <td>{{ member.user.email }}</td>
                    <td class="text-right">
                      <v-chip
                        v-if="member.user.sub === member.user.email"
                        color="error"
                        outlined
                        small
                      >
                        Pending
                      </v-chip>
                      <v-btn
                        icon
                        @click="
                          removeUserId = member.user.sub
                          removeDialog = true
                        "
                      >
                        <v-icon>{{ mdiCloseCircle }}</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card flat>
            <v-card-title>Organisations</v-card-title>
            <v-card-text class="px-0">
              <p class="px-4">
                These are the organisations you're a member of.
              </p>

              <v-alert
                v-if="!memberOf.length"
                class="my-0 mx-4"
                color="info"
                text
              >
                You don't belong to any organisations.
              </v-alert>
              <v-simple-table v-else>
                <thead>
                  <tr>
                    <th>Organisation</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="{ organisationId: id, name, status } in memberOf"
                    :key="id"
                  >
                    <td>
                      {{ name }}
                    </td>
                    <td class="text-right">
                      <v-btn
                        v-if="status === 'Active'"
                        color="accent"
                        outlined
                        small
                        :loading="switching"
                        @click="switchTo(id)"
                      >
                        <v-icon left> {{ mdiAccountSwitch }} </v-icon>Switch to
                      </v-btn>
                      <v-btn
                        v-else
                        color="accent"
                        outlined
                        small
                        :loading="activating"
                        @click="
                          activateOrganisationId = id
                          activate()
                        "
                      >
                        Activate
                      </v-btn>
                      <v-btn
                        icon
                        @click="
                          removeOrganisationId = id
                          removeOrganisationDialog = true
                        "
                      >
                        <v-icon>{{ mdiCloseCircle }}</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <v-dialog v-model="createDialog" max-width="400px" eager>
      <v-card>
        <v-card-title> Add member </v-card-title>
        <v-card-text class="pb-0">
          <p>
            The member will receive an email asking them to join the
            organisation. They will be listed as 'pending' until they accept the
            invition.
          </p>

          <v-alert v-if="createError" type="error" text>
            {{ createError }}
          </v-alert>

          <v-form ref="form" @submit.prevent="create" class="mt-6">
            <v-text-field
              v-model="email"
              :rules="rules.email"
              label="Email address"
              placeholder="info@example.com"
              outlined
              dense
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" text @click="createDialog = false">
            Cancel
          </v-btn>
          <v-btn :loading="creating" color="accent" text @click="create">
            <v-icon left>
              {{ mdiEmail }}
            </v-icon>
            Send invitation
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="removeDialog" max-width="400px" eager>
      <v-card>
        <v-card-title> Remove member </v-card-title>
        <v-card-text class="pb-0">
          <v-alert v-if="removeError" type="error" text>
            {{ removeError }}
          </v-alert>

          This member will be removed from the organisation.
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

    <v-dialog v-model="removeOrganisationDialog" max-width="400px" eager>
      <v-card>
        <v-card-title> Leave organisation </v-card-title>
        <v-card-text class="pb-0">
          <v-alert v-if="removeOrganisationError" type="error" text>
            {{ removeOrganisationError }}
          </v-alert>

          You will not be able to join to organisation again unless you're
          re-invited.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="removeOrganisationDialog = false">
            Cancel
          </v-btn>
          <v-btn
            :loading="removingOrganisation"
            color="error"
            text
            @click="removeOrganisation"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="accessDialog" max-width="600px" eager>
      <v-card>
        <v-card-title>Permissions</v-card-title>
        <v-card-text class="px-0">
          <v-simple-table dense>
            <thead>
              <tr>
                <th class="px-6">Access</th>
                <th width="25%" class="px-6 text-center">Owner (you)</th>
                <th width="25%" class="px-6 text-center">Member</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, access) in permissions" :key="access">
                <td class="px-6">
                  <small>{{ access }}</small>
                </td>
                <td class="px-6 text-center">
                  <v-icon color="success" small>
                    {{ mdiCheck }}
                  </v-icon>
                </td>
                <td class="px-6 text-center">
                  <v-icon :color="member ? 'success' : 'error'" small>
                    {{ member ? mdiCheck : mdiClose }}
                  </v-icon>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="accessDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiAccountPlus,
  mdiEmail,
  mdiCloseCircle,
  mdiAccountSwitch,
  mdiCheck,
  mdiClose,
} from '@mdi/js'

import permissions from '~/assets/json/permissions.json'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Organisation',
      accessDialog: false,
      createDialog: false,
      creating: false,
      createError: false,
      activating: false,
      activateOrganisationId: null,
      removeUserId: null,
      removing: false,
      removingOrganisation: false,
      removeDialog: false,
      removeOrganisationDialog: false,
      removeError: false,
      removeOrganisationError: false,
      switching: false,
      permissions,
      tab: null,
      error: false,
      email: '',
      loading: true,
      rules: {
        email: [(v) => /@/.test(v) || 'Enter a valid email address'],
      },
      success: false,
      organisation: {
        seats: 0,
        seatsRemaining: 0,
        members: [],
      },
      mdiAccountPlus,
      mdiEmail,
      mdiCloseCircle,
      mdiAccountSwitch,
      mdiCheck,
      mdiClose,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      memberOf: ({ organisations }) => organisations.memberOf,
    }),
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          this.organisation = (await this.$axios.get('organisation')).data

          this.loading = false
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
    tab(index) {
      if (index === 1) {
        if (this.$route.hash !== '#memberships') {
          this.$router.replace({ path: '/organisation/', hash: '#memberships' })
        }
      } else if (this.$route.hash === '#memberships') {
        this.$router.replace({ path: '/organisation/' })
      }
    },
  },
  created() {
    if (this.$route.hash === '#memberships') {
      this.tab = 1
    }
  },
  async mounted() {
    if (this.$store.state.user.isSignedIn) {
      try {
        this.organisation = (await this.$axios.get('organisation')).data

        this.loading = false
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    ...mapActions({
      getMemberOf: 'organisations/get',
    }),
    async create() {
      this.success = false
      this.error = false
      this.createError = false
      this.creating = true

      if (this.$refs.form.validate()) {
        try {
          await this.$axios.put(
            `organisation/${this.email.toLowerCase().trim()}`
          )

          this.getMemberOf()

          this.organisation = (await this.$axios.get('organisation')).data

          this.success = 'The invitation has been sent'
          this.email = ''

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
        await this.$axios.delete(`organisation/${this.removeUserId}`)

        this.getMemberOf()

        this.organisation = (await this.$axios.get('organisation')).data

        this.success = 'The member has been removed.'

        this.removeDialog = false
      } catch (error) {
        this.removeError = this.getErrorMessage(error)
      }

      this.removing = false
    },
    async removeOrganisation() {
      this.success = false
      this.error = false
      this.removeOrganisationError = false
      this.removingOrganisation = true

      try {
        await this.$axios.delete(`organisation/${this.removeOrganisationId}`)

        await this.getMemberOf()

        this.organisation = (await this.$axios.get('organisation')).data

        this.success = 'You are no longer a member of the organisation.'

        this.removeOrganisationDialog = false
      } catch (error) {
        this.removeOrganisationError = this.getErrorMessage(error)
      }

      this.removingOrganisation = false
    },
    async activate() {
      this.success = false
      this.error = false
      this.activating = true

      try {
        await this.$axios.patch(
          `organisation/${this.activateOrganisationId}/activate`
        )

        await this.getMemberOf()

        this.organisation = (await this.$axios.get('organisation')).data

        this.success = 'The organisation has been activated.'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.activating = false
    },
    async toggle(member) {
      this.error = false
      member.loading = true

      try {
        await this.$axios.patch(`organisation/${member.user.sub}`, {
          enabled: member.enabled,
        })

        this.organisation = (await this.$axios.get('organisation')).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      delete member.loading
    },
    async switchTo(organisationId) {
      this.error = false
      this.success = false
      this.switching = true

      try {
        await this.signInAs(organisationId)
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.switching = false
    },
  },
}
</script>
