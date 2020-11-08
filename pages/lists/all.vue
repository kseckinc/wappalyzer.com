<template>
  <Page :title="title" :loading="!lists && !error" secure>
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <div class="mb-4">
      <v-btn href="/lists/" color="accent" outlined>
        <v-icon left>{{ mdiPlus }}</v-icon>
        Create a new list
      </v-btn>
    </div>

    <template v-if="lists">
      <v-card class="mb-4">
        <v-card-text v-if="!lists.length">
          <v-alert class="ma-0" color="info" outlined>
            You don't have any lists.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="20%">ID</th>
                <th>Technologies</th>
                <th width="20%">Websites</th>
                <th width="20%">Date</th>
                <th width="1">Paid</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="list in lists">
                <tr :key="list.createdAt">
                  <td>
                    <nuxt-link :to="`/lists/${list.id}`">{{
                      list.id
                    }}</nuxt-link>
                  </td>
                  <td>
                    <small>
                      {{ list.technologies.slice(0, 10).join(', ') }}
                      <template v-if="list.technologies.length > 10">
                        (+{{ list.technologies.length - 10 }} more)
                      </template>
                    </small>
                  </td>
                  <td v-if="list.status === 'Calculating'">
                    <Spinner />
                  </td>
                  <td v-else>{{ formatNumber(list.rows) }}</td>
                  <td>{{ formatDate(new Date(list.createdAt * 1000)) }}</td>
                  <td>
                    <v-btn v-if="list.status === 'Complete'" icon>
                      <v-icon color="success">{{
                        mdiCheckboxMarkedOutline
                      }}</v-icon>
                    </v-btn>
                    <v-btn v-else disabled icon>
                      <v-icon>{{ mdiCheckboxBlankOutline }}</v-icon>
                    </v-btn>
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
import {
  mdiPlus,
  mdiCheckboxMarkedOutline,
  mdiCheckboxBlankOutline,
} from '@mdi/js'
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
      mdiCheckboxMarkedOutline,
      mdiCheckboxBlankOutline,
    }
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
