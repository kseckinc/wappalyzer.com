<template>
  <Page :title="title" :head="{ title, text: 'TODO' }">
    <v-card color="secondary" style="overflow: hidden;" class="mt-12 mb-4">
      <v-card-title>
        <v-row>
          <v-col cols="12" sm="4" class="py-0">
            <v-icon color="primary" left>{{ mdiDomain }}</v-icon>
            Company to URL
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="pb-0">
        <v-form ref="form" @submit.prevent="submit">
          <v-text-field
            ref="input"
            v-model="companyName"
            :append-icon="mdiMagnify"
            style="background-color: white;"
            label="Enter a company name"
            placeholder="Facebook"
            class="mb-4"
            required
            outlined
            large
            hide-details="auto"
            @click:append="submit"
          />
        </v-form>

        <v-alert v-if="error" color="info" outlined>
          {{ error }}
        </v-alert>

        <v-card v-if="loading" class="mb-4">
          <v-card-text class="d-flex justify-center">
            <Progress />
          </v-card-text>
        </v-card>
        <v-expansion-panels v-else-if="hostnames.length" class="my-4">
          <v-expansion-panel
            v-for="hostname in hostnames"
            :key="hostname.hostname"
          >
            <v-expansion-panel-header>
              <div>
                {{ hostname.hostname }}

                <a
                  :href="`http${hostname.https ? 's' : ''}://${
                    hostname.www ? 'www.' : ''
                  }${hostname.hostname}`"
                  rel="nofollow noopener"
                  target="_blank"
                  ><v-icon color="accent" small>{{ mdiOpenInNew }}</v-icon></a
                >
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="no-padding">
              <v-alert
                v-if="Object.keys(hostname).length === 4"
                color="accent"
                class="mx-4 mb-4"
                outlined
              >
                <p>
                  No meta data available... Yet.
                </p>

                <v-btn
                  :to="`/lookup/?url=${encodeURIComponent(
                    `http://${hostname}`
                  )}`"
                  color="accent"
                  outlined
                  ><v-icon left>{{ mdiMagnify }}</v-icon> Technology
                  lookup</v-btn
                >
              </v-alert>
              <v-card v-else flat>
                <div
                  v-for="(set, setKey) in transformAttributes(
                    ['locale', 'email', 'phone', 'social', 'meta'],
                    hostname
                  )"
                  :key="setKey"
                >
                  <v-divider />

                  <v-card-title class="subtitle-2 px-6">{{
                    set.title
                  }}</v-card-title>
                  <v-card-text class="px-0 pb-0">
                    <v-simple-table dense>
                      <tbody>
                        <tr
                          v-for="(attribute, attributeKey) in set.attributes"
                          :key="attributeKey"
                        >
                          <th class="pl-6" width="25%">
                            <small>
                              {{ attribute.title }}
                            </small>
                          </th>
                          <td class="pr-6">
                            <div
                              v-for="(value, index) in attribute.values"
                              :key="index"
                            >
                              <small>
                                <a
                                  v-if="value.to"
                                  :href="value.to"
                                  rel="nofollow noopener"
                                  target="_blank"
                                  >{{ value.text }}</a
                                >
                                <v-icon
                                  v-else-if="value.text === true"
                                  color="success"
                                  small
                                  >{{ mdiCheck }}</v-icon
                                >
                                <v-icon
                                  v-else-if="value.text === false"
                                  color="error"
                                  small
                                  >{{ mdiClose }}</v-icon
                                >
                                <span
                                  v-else
                                  :class="
                                    attributeKey === 'phone' ? 'blur' : ''
                                  "
                                >
                                  {{ value.text }}
                                </span>
                              </small>
                            </div>
                          </td>
                        </tr>
                      </tbody>

                      <tbody></tbody
                    ></v-simple-table>
                  </v-card-text>
                </div>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    :to="`/lookup/?url=${encodeURIComponent(
                      `http://${hostname}`
                    )}`"
                    color="accent"
                    text
                    ><v-icon left>{{ mdiMagnify }}</v-icon> Technology
                    lookup</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </Page>
</template>

<script>
import {
  mdiDomain,
  mdiMagnify,
  mdiCheck,
  mdiClose,
  mdiOpenInNew,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Progress from '~/components/Progress.vue'

export default {
  components: {
    Page,
    Progress,
  },
  data() {
    return {
      title: 'Company website finder',
      error: false,
      loading: false,
      mdiMagnify,
      mdiCheck,
      mdiClose,
      mdiDomain,
      mdiOpenInNew,
      companyName: '',
      lastCompanyName: '',
      hostnames: [],
    }
  },
  mounted() {
    ;({ company: this.companyName } = this.$route.query)

    if (this.companyName) {
      this.$router.replace({ path: this.$route.path })
    }

    this.$refs.input.focus()

    if (this.companyName) {
      this.$nextTick(() => this.submit())
    }
  },
  methods: {
    async submit() {
      if (
        this.companyName === this.lastCompanyName &&
        (this.hostnames || this.error)
      ) {
        return
      }

      this.lastCompanyName = this.companyName

      this.error = false
      this.hostnames = false

      this.loading = true

      try {
        ;({ hostnames: this.hostnames } = (
          await this.$axios(`company/${encodeURIComponent(this.companyName)}`)
        ).data)
      } catch (error) {
        this.error =
          (error.response && error.response.data) || this.getErrorMessage(error)
      }

      this.loading = false
    },
  },
}
</script>

<style>
.v-expansion-panel-content.no-padding .v-expansion-panel-content__wrap {
  padding: 0;
}

.blur {
  filter: blur(3px);
}
</style>
