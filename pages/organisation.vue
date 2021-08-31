<template>
  <Page :title="title" :loading="loading && !error" secure>
    <v-alert v-if="success" type="success" text>
      {{ success }}
    </v-alert>

    <v-alert v-if="error" type="error" text>
      {{ error }}
    </v-alert>

    <v-expansion-panels v-model="panels" accordion>
      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-1 font-weight-medium">
          {{ isMember ? 'Organisation' : 'Your organisation' }} ({{
            user.billingName || user.name || user.email
          }})
        </v-expansion-panel-header>
        <v-expansion-panel-content class="no-x-padding body-2" eager>
          <div class="px-6" style="max-width: 600px">
            <p>
              Members have
              <a @click="accessDialog = true">limited access</a> to
              {{ isMember ? 'the' : 'your' }}
              account. They can create orders and spend credits. Additional
              seats are included with selected
              <nuxt-link to="/pricing/">plans</nuxt-link>.
            </p>
          </div>

          <v-divider class="my-6" />

          <h3 class="subtitle-2 mx-6 mb-2">Members</h3>

          <v-alert
            v-if="!organisation.members.length"
            class="mx-6"
            color="info"
            text
          >
            You're the only member of this organisation.
          </v-alert>

          <v-simple-table v-else class="mb-4">
            <thead>
              <tr>
                <th width="1">Enabled</th>
                <th>
                  Role
                  <sup>
                    <v-icon class="ml-1" small @click="accessDialog = true">{{
                      mdiHelpCircleOutline
                    }}</v-icon>
                  </sup>
                </th>
                <th>Name</th>
                <th>Email address</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in organisation.members" :key="member.user.sub">
                <td width="1">
                  <v-switch
                    v-model="member.enabled"
                    :disabled="
                      (!member.enabled && !organisation.seatsRemaining) ||
                      member.user.sub === impersonatorUserId
                    "
                    :loading="member.updatingStatus"
                    class="ma-0 pa-0 mx-auto"
                    hide-details
                    inset
                    @change="toggleStatus(member)"
                  />
                </td>
                <td width="1">
                  <v-select
                    ref="role"
                    v-model="member.role"
                    style="width: 150px"
                    :loading="member.updatingRole"
                    :disabled="member.user.sub === impersonatorUserId"
                    :items="roles"
                    dense
                    hide-details
                    @change="updateRole(member)"
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
                    color="warning"
                    outlined
                    small
                  >
                    Pending
                  </v-chip>
                  <v-btn
                    icon
                    color="error"
                    :disabled="member.user.sub === impersonatorUserId"
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

          <div class="d-flex align-center justify-end mr-6 mb-2">
            <small class="text--disabled mr-4"
              >{{ organisation.seatsRemaining }} of
              {{ organisation.seats }} seats available</small
            ><v-btn
              :disabled="!organisation.seatsRemaining"
              color="accent lighten-1 accent--text"
              depressed
              @click="createDialog = true"
            >
              <v-icon left>
                {{ mdiAccountPlus }}
              </v-icon>
              Add member
            </v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel v-if="!isMember">
        <v-expansion-panel-header class="subtitle-1 font-weight-medium"
          >Your memberships</v-expansion-panel-header
        >
        <v-expansion-panel-content class="no-x-padding body-2">
          <p class="mx-6">These are the organisations you're a member of.</p>

          <v-alert v-if="!memberOf.length" class="mx-6 mb-2" color="info" text>
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
                    color="accent lighten-1 accent--text"
                    depressed
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
                    color="error"
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
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

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
            />

            <v-select
              v-model="role"
              :items="roles"
              label="Role"
              outlined
              required
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

    <v-dialog v-model="accessDialog" max-width="800px" eager>
      <v-card>
        <v-card-title>Roles and permissions</v-card-title>
        <v-card-text class="px-0">
          <v-simple-table dense>
            <thead>
              <tr>
                <th width="40%" class="px-6">Permissions</th>
                <th width="15%" class="px-6 text-center">Owner</th>
                <th width="15%" class="px-6 text-center">Admin</th>
                <th width="15%" class="px-6 text-center">Developer</th>
                <th width="15%" class="px-6 text-center">Buyer</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(roles, access) in permissions" :key="access">
                <td class="px-6">
                  <small>{{ access }}</small>
                </td>
                <td class="px-6 text-center">
                  <v-icon color="success">
                    {{ mdiCheckCircle }}
                  </v-icon>
                </td>
                <td
                  v-for="role in ['admin', 'developer', 'buyer']"
                  class="px-6 text-center"
                  :key="role"
                >
                  <v-icon :color="roles.includes(role) ? 'success' : 'error'">
                    {{ roles.includes(role) ? mdiCheckCircle : mdiCloseCircle }}
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
  mdiCheckCircle,
  mdiHelpCircleOutline,
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
      role: 'buyer',
      switching: false,
      permissions,
      panels: 0,
      roles: [
        {
          value: 'buyer',
          text: 'Buyer',
        },
        {
          value: 'developer',
          text: 'Developer',
        },
        {
          value: 'admin',
          text: 'Admin',
        },
      ],
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
      mdiCheckCircle,
      mdiHelpCircleOutline,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      memberOf: ({ organisations }) => organisations.memberOf,
      isMember: ({ user }) =>
        !user.admin && user.impersonator && !user.impersonator.admin,
      impersonatorUserId: ({ user }) =>
        !user.admin && user.impersonator && !user.impersonator.admin
          ? user.impersonator.sub
          : '',
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
    panels(index) {
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
      this.panels = 1
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
            `organisation/${this.email.toLowerCase().trim()}`,
            { role: this.role }
          )

          this.getMemberOf()

          this.organisation = (await this.$axios.get('organisation')).data

          this.success = 'The invitation has been sent'
          this.email = ''
          this.role = 'buyer'

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
    async toggleStatus(member) {
      this.error = false
      member.updatingStatus = true

      try {
        await this.$axios.patch(`organisation/${member.user.sub}`, {
          enabled: member.enabled,
        })

        this.organisation = (await this.$axios.get('organisation')).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      delete member.updatingStatus
    },
    async updateRole(member) {
      this.error = false
      member.updatingRole = true

      try {
        await this.$axios.patch(`organisation/${member.user.sub}`, {
          role: member.role,
        })

        this.organisation = (await this.$axios.get('organisation')).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      delete member.updatingRole
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
