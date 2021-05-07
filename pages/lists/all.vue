<template>
  <Page :title="title" :loading="!lists && !error" secure>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <v-row align="center" class="mb-4">
      <v-col class="py-0">
        <v-btn href="/lists/" depressed>
          <v-icon left>{{ mdiPlus }}</v-icon>
          Create a new list
        </v-btn>
      </v-col>
      <v-col
        v-if="lists && lists.length !== myLists.length"
        class="py-0 text-right"
      >
        <v-switch
          v-model="viewMine"
          class="ma-0 d-inline-block"
          label="Show only my lists"
          hide-details
        />
      </v-col>
    </v-row>

    <template v-if="lists">
      <v-card class="mb-4">
        <v-card-text v-if="!filteredLists.length">
          <v-alert class="ma-0" color="info" outlined>
            You don't have any lists.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="15%">ID</th>
                <th>Tech / keywords</th>
                <th width="15%">Websites</th>
                <th width="15%">Date</th>
                <th width="1">Repeat</th>
                <th width="1">Paid</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="list in filteredLists">
                <tr :key="list.createdAt">
                  <td style="white-space: nowrap">
                    <nuxt-link :to="`/lists/${list.id}`">{{
                      list.id
                    }}</nuxt-link>

                    <v-tooltip v-if="list.repeatListId" max-width="250" top>
                      <template #activator="{ on }">
                        <nuxt-link
                          v-if="list.repeatListId"
                          :to="`/lists/${list.repeatListId}`"
                        >
                          <sup>
                            <v-icon color="accent" small v-on="on">{{
                              mdiCreation
                            }}</v-icon>
                          </sup>
                        </nuxt-link>
                      </template>

                      Weekly update of list {{ list.repeatListId }}. Click to
                      manage.
                    </v-tooltip>
                  </td>
                  <td>
                    <v-chip-group v-if="list.technologies.length" column>
                      <v-chip
                        v-for="technology in list.technologies.slice(0, 10)"
                        :key="technology"
                        small
                        outlined
                        label
                      >
                        {{ technology }}
                      </v-chip>
                      <v-chip
                        v-if="list.technologies.length > 10"
                        small
                        outlined
                        label
                      >
                        (+{{ list.technologies.length - 10 }} more)
                      </v-chip>
                    </v-chip-group>
                    <v-chip-group v-else-if="list.keywords.length" column>
                      <v-chip
                        v-for="keyword in list.keywords.slice(0, 10)"
                        :key="keyword"
                        small
                        outlined
                        label
                      >
                        {{ keyword }}
                      </v-chip>
                      <v-chip
                        v-if="list.keywords.length > 10"
                        small
                        outlined
                        label
                      >
                        (+{{ list.keywords.length - 10 }} more)
                      </v-chip>
                    </v-chip-group>
                  </td>
                  <td v-if="list.status === 'Calculating'">
                    <Spinner />
                  </td>
                  <td v-else>
                    {{ list.rows ? formatNumber(list.rows) : '-' }}
                  </td>
                  <td>{{ formatDate(new Date(list.createdAt * 1000)) }}</td>
                  <td class="text-center">
                    <v-icon v-if="list.repeat">{{ mdiRepeat }}</v-icon>
                  </td>
                  <td class="text-center">
                    <v-icon v-if="list.status === 'Complete'" color="success">{{
                      mdiCheck
                    }}</v-icon>
                  </td>
                </tr>
              </template>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </template>
  </Page>
</template>

<script>
import { mapState } from 'vuex'
import { mdiPlus, mdiCheck, mdiRepeat, mdiCreation } from '@mdi/js'
import Page from '~/components/Page.vue'
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    Page,
    Spinner,
  },
  data() {
    return {
      title: 'Lead lists',
      error: false,
      lists: null,
      mdiPlus,
      mdiCheck,
      mdiRepeat,
      mdiCreation,
      viewMine: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isMember: ({ user }) =>
        !user.attrs.admin && user.impersonator && !user.impersonator.admin,
      impersonator: ({ user }) => user.impersonator,
    }),
    myLists() {
      return this.lists.filter(({ memberId }) =>
        this.isMember ? memberId === this.impersonator.sub : !memberId
      )
    },
    filteredLists() {
      return this.viewMine ? this.myLists : this.lists
    },
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          this.lists = (await this.$axios.get('lists')).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        this.lists = (await this.$axios.get('lists')).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
}
</script>

<style>
.loader {
  animation: loader 1.5s infinite;
  display: flex;
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
