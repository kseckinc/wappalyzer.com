<template>
  <Page
    :title="title"
    :crumbs="[{ title: 'Lists', to: '/lists/all/' }]"
    :loading="!list && !error"
    secure
    no-side-bar
  >
    <v-alert v-if="error" type="error" class="mb-8">
      {{ error }}
    </v-alert>

    <template v-if="list">
      <v-row>
        <v-col cols="12" md="4" order-md="1" class="py-0">
          <div
            v-if="list.status === 'Complete'"
            class="d-flex flex-column align-stretch mb-4"
          >
            <v-btn
              color="primary"
              :href="`${datasetsBaseUrl}${list.filename}`"
              x-large
            >
              <v-icon left size="20">{{ mdiDownload }}</v-icon>
              Download list
            </v-btn>
          </div>

          <v-card v-if="list.status === 'Ready'" class="mb-4">
            <v-card-text class="px-0 pb-2">
              <v-simple-table class="mb-4">
                <tbody>
                  <tr>
                    <th width="40%">Websites</th>
                    <td>
                      {{
                        formatNumber(
                          totalRows(list.rows, list.query.matchAllTechnologies)
                        )
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <td v-if="isMember">
                      {{ formatNumber(list.totalCredits) }} credits
                    </td>
                    <td v-else>
                      {{ formatCurrency(list.total / 100) }}
                      <span class="text--disabled"
                        >/ {{ formatNumber(list.totalCredits) }} credits</span
                      >
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>

              <div class="d-flex flex-column align-stretch mx-4">
                <v-btn
                  color="primary"
                  x-large
                  depressed
                  :loading="submitting"
                  @click="submit"
                >
                  <v-icon left size="20">{{ mdiCart }}</v-icon>
                  Checkout
                </v-btn>

                <v-btn
                  class="font-weight-regular mt-2"
                  text
                  small
                  @click="$refs.faqDialog.open()"
                >
                  Frequently asked questions
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <v-expansion-panels v-model="sidePanelIndex" class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-header class="subtitle-2">
                Technologies
              </v-expansion-panel-header>
              <v-expansion-panel-content class="no-x-padding">
                <v-simple-table>
                  <tbody>
                    <tr>
                      <th>Technology</th>
                      <th class="text-right">Websites</th>
                    </tr>
                    <tr
                      v-for="technology in technologies"
                      :key="technology.slug"
                      outlined
                      small
                    >
                      <td>
                        <div class="d-flex align-center">
                          <TechnologyIcon :icon="technology.icon" />
                          <nuxt-link
                            :to="`/technologies${
                              technology.categories.length
                                ? `/${technology.categories[0].slug}`
                                : ''
                            }/${technology.slug}`"
                          >
                            {{ technology.name }}
                          </nuxt-link>
                          <template
                            v-if="technology.operator && technology.version"
                          >
                            &nbsp;({{ technology.operator
                            }}{{ technology.version }})
                          </template>
                        </div>
                      </td>
                      <td
                        v-if="list.status === 'Insufficient'"
                        class="text-right"
                      >
                        -
                      </td>
                      <td
                        v-else-if="list.status !== 'Calculating'"
                        class="text-right"
                      >
                        {{ formatNumber(list.rows[technology.slug]) }}
                      </td>
                      <td v-else class="text-right">
                        <Spinner />
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>

                <div class="text-right">
                  <v-btn
                    v-if="list.query.technologies.length > 20"
                    color="accent"
                    class="mt-2 mr-3"
                    text
                    small
                    @click="technologiesViewAll = !technologiesViewAll"
                  >
                    <v-icon small left text>{{
                      technologiesViewAll ? mdiMinus : mdiPlus
                    }}</v-icon>
                    {{
                      technologiesViewAll
                        ? 'View less'
                        : `View all ${list.query.technologies.length}`
                    }}
                  </v-btn>
                </div>

                <v-card-text
                  v-if="list.query.technologies.length >= 2"
                  class="px-6 pb-0"
                >
                  <small>
                    <template v-if="list.query.matchAllTechnologies === 'and'">
                      Matching <strong>all</strong> of the above.
                    </template>
                    <template
                      v-else-if="list.query.matchAllTechnologies === 'not'"
                    >
                      Excluding
                      <nuxt-link
                        :to="`/technologies${
                          list.query.technologies[1].categories[0]
                            ? `/${list.query.technologies[1].categories[0].slug}`
                            : ''
                        }/${list.query.technologies[1].slug}/`"
                        >{{ list.query.technologies[1].name }}</nuxt-link
                      >.
                    </template>
                    <template v-else
                      >Matching <strong>any</strong> of the above.</template
                    >
                  </small>
                </v-card-text>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header class="subtitle-2">
                Filters and limits
              </v-expansion-panel-header>
              <v-expansion-panel-content class="no-x-padding">
                <v-simple-table>
                  <tbody>
                    <tr v-if="list.query.industries.length">
                      <th width="40%">Industries</th>
                      <td>
                        <v-chip-group class="my-2" column
                          ><v-chip
                            v-for="{ text, value } in list.query.industries"
                            :key="value"
                            outlined
                            small
                            label
                          >
                            {{ text }}
                          </v-chip>
                        </v-chip-group>
                      </td>
                    </tr>
                    <tr v-if="list.query.subset">
                      <th width="40%">List size limit</th>
                      <td>
                        {{ formatNumber(list.query.subset) }}
                        ({{
                          list.query.subsetSlice === 1
                            ? 'high'
                            : list.query.subsetSlice === 2
                            ? 'medium'
                            : list.query.subsetSlice === 3
                            ? 'low'
                            : list.query.subsetSlice === 4
                            ? 'lowest'
                            : 'highest'
                        }}
                        traffic)
                      </td>
                    </tr>
                    <tr v-if="list.query.excludeNoTraffic">
                      <th width="40%">Exclude websites without traffic data</th>
                      <td>
                        <v-icon color="primary">{{ mdiCheckboxMarked }}</v-icon>
                      </td>
                    </tr>
                    <tr v-if="list.exclusionsFilename">
                      <th width="40%">Exclusions</th>
                      <td>
                        <v-btn
                          :href="`${datasetsBaseUrl}${list.exclusionsFilename}`"
                          color="accent"
                          icon
                          ><v-icon>{{ mdiDownload }}</v-icon></v-btn
                        >
                      </td>
                    </tr>
                    <tr>
                      <th width="40%">Data age</th>
                      <td>
                        {{ list.query.minAge || 0 }}-{{
                          list.query.maxAge || 3
                        }}
                        months
                      </td>
                    </tr>
                    <tr v-if="list.query.requiredSets.length">
                      <th width="40%">Required</th>
                      <td>
                        <div v-for="key in list.query.requiredSets" :key="key">
                          {{
                            (set = sets.find(
                              ({ key: _key }) => _key === key
                            )) && null
                          }}
                          {{
                            (set.name || key).charAt(0).toUpperCase() +
                            (set.name || key).substring(1)
                          }}
                        </div>
                      </td>
                    </tr>
                    <tr v-if="list.query.geoIps.length">
                      <th width="40%">IP countries</th>
                      <td>
                        <v-chip-group class="my-2" column>
                          <v-tooltip
                            v-for="{ text, value } in list.query.geoIps"
                            :key="value"
                            bottom
                          >
                            <template #activator="{ on }">
                              <v-chip outlined small label v-on="on">
                                {{ value }}
                              </v-chip>
                            </template>

                            {{ text }}
                          </v-tooltip>
                        </v-chip-group>
                      </td>
                    </tr>
                    <tr v-if="list.query.tlds.length">
                      <th width="40%">TLDs</th>
                      <td>
                        <v-chip-group class="my-2" column>
                          <v-chip
                            v-for="tld in list.query.tlds"
                            :key="tld"
                            outlined
                            small
                            label
                            >{{ tld }}</v-chip
                          >
                        </v-chip-group>
                      </td>
                    </tr>
                    <tr v-if="list.query.languages.length">
                      <th width="40%">Languages</th>
                      <td>
                        <v-chip-group class="my-2" column>
                          <v-tooltip
                            v-for="{ text, value } in list.query.languages"
                            :key="value"
                            bottom
                          >
                            <template #activator="{ on }">
                              <v-chip outlined small label v-on="on">
                                {{ value }}
                              </v-chip>
                            </template>

                            {{ text }}
                          </v-tooltip>
                        </v-chip-group>
                      </td>
                    </tr>
                    <tr v-if="list.query.matchAll">
                      <th width="40%">Match all filters</th>
                      <td>
                        <v-icon color="primary">{{ mdiCheckboxMarked }}</v-icon>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header class="subtitle-2">
                Included attributes
              </v-expansion-panel-header>
              <v-expansion-panel-content class="no-x-padding">
                <v-alert
                  v-if="
                    list.query.compliance === 'exclude' ||
                    list.query.compliance === 'excludeEU'
                  "
                  color="warning"
                  class="mx-6"
                  dense
                  outlined
                >
                  <div class="subtitle-2">Compliance</div>
                  <small v-if="list.query.compliance === 'exclude'">
                    Contact details are excluded.
                  </small>
                  <small v-else-if="list.query.compliance === 'excludeEU'">
                    Contact details are excluded for EU websites.
                  </small>
                </v-alert>

                <v-simple-table dense>
                  <tbody>
                    <tr>
                      <th>Attribute set</th>
                      <th class="text-right">Results</th>
                    </tr>
                    <v-tooltip
                      v-for="set in sets.filter(
                        ({ key }) =>
                          key === 'base-list' || list.sets.includes(key)
                      )"
                      :key="set.key"
                      top
                    >
                      <template #activator="{ on }">
                        <tr v-on="on">
                          <td>
                            <small>
                              {{ set.name }}
                            </small>
                          </td>
                          <td
                            v-if="list.status === 'Insufficient'"
                            class="text-right"
                          >
                            -
                          </td>
                          <td
                            v-else-if="list.status !== 'Calculating'"
                            class="text-right"
                          >
                            <small>
                              {{
                                formatNumber(
                                  set.key === 'base-list'
                                    ? totalRows(
                                        list.rows,
                                        list.query.matchAllTechnologies
                                      )
                                    : list.setRows[set.key] || 0
                                )
                              }}
                            </small>
                          </td>
                          <td v-else class="text-right">
                            <Spinner />
                          </td>
                        </tr>
                      </template>

                      {{
                        set.attributes
                          .map(
                            ({ name, key }) =>
                              (name || key).charAt(0).toUpperCase() +
                              (name || key).substring(1)
                          )
                          .join(', ')
                      }}
                    </v-tooltip>
                  </tbody>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <div v-if="list.status !== 'Complete'" class="mb-4 text-right">
            <v-btn :to="`/lists/${queryParams}`" color="accent" outlined small>
              <v-icon left>{{ mdiPencil }}</v-icon>
              Edit
            </v-btn>
            <v-btn
              color="error"
              class="ml-2"
              outlined
              small
              @click="cancelDialog = true"
            >
              <v-icon left>{{ mdiDelete }}</v-icon>
              Delete
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="8" class="py-0">
          <v-alert v-if="list.status === 'Calculating'" type="info" outlined>
            Your list is being created. This may take a few minutes, we'll send
            you an email when it's ready.
          </v-alert>

          <v-alert v-if="list.status === 'Failed'" type="error">
            Sorry, something went wrong during the processing of your list.
            Please contact us.
          </v-alert>

          <v-alert
            v-if="list.status === 'Insufficient'"
            color="warning lighten-2"
          >
            <p>
              Sorry, we don't have results available matching your requirements.
              Please try it again with different or no filters.
            </p>

            <v-btn :to="`/lists/${queryParams}`" color="white" exact>
              <v-icon left>{{ mdiArrowLeft }}</v-icon>
              Change requirements
            </v-btn>
          </v-alert>

          <v-alert v-if="list.status === 'Ready'" type="success" outlined>
            Your list is ready. Please review the samples and availability.
          </v-alert>

          <v-expansion-panels
            v-if="['Ready', 'Complete'].includes(list.status)"
            v-model="panelIndex"
            class="mb-6"
          >
            <v-expansion-panel
              v-for="technology in list.query.technologies.filter(
                ({ sample }) => sample && sample.length
              )"
              :key="technology.slug"
            >
              <v-expansion-panel-header>
                <template v-if="list.query.matchAllTechnologies !== 'or'">
                  <div class="d-flex align-center">
                    <div
                      v-for="_technology in list.query.technologies"
                      :key="`${_technology.slug}_1`"
                    >
                      <TechnologyIcon :icon="_technology.icon" />
                    </div>
                    <div
                      v-for="(_technology, index) in list.query.technologies"
                      :key="`${_technology.slug}_2`"
                    >
                      <span v-if="index" class="ml-1">
                        <template
                          v-if="list.query.matchAllTechnologies === 'and'"
                          >+</template
                        >
                        <template
                          v-if="list.query.matchAllTechnologies === 'not'"
                          >-</template
                        >
                      </span>
                      {{ _technology.name }}
                    </div>
                    <span class="ml-1 text--disabled">(sample)</span>
                  </div>
                </template>
                <div v-else class="d-flex align-center">
                  <TechnologyIcon :icon="technology.icon" />
                  {{ technology.name }}
                  <span class="ml-1 text--disabled">(sample)</span>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="no-x-padding no-b-padding">
                <v-simple-table>
                  <thead>
                    <tr>
                      <th
                        v-for="key in Object.keys(technology.sample[0])"
                        :key="key"
                        style="white-space: nowrap"
                      >
                        {{ formatAttribute(key) || key }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in technology.sample" :key="index">
                      <td
                        v-for="(column, attribute) in row"
                        :key="attribute"
                        style="
                          white-space: nowrap;
                          max-width: 300px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                        "
                      >
                        <small>
                          <template v-if="Array.isArray(column)">
                            <div
                              v-for="(value, index2) in column"
                              :key="index2"
                            >
                              {{
                                (formatted = formatAttribute(
                                  attribute,
                                  value
                                )) && null
                              }}
                              <a
                                v-if="formatted.to"
                                :href="formatted.to"
                                rel="noopener nofollow"
                                target="_blank"
                                >{{ formatted.text }}</a
                              >
                              <template v-else>
                                {{ formatted }}
                              </template>
                            </div>
                          </template>
                          <template v-else>
                            {{
                              (formatted = formatAttribute(
                                attribute,
                                column
                              )) && null
                            }}
                            <a
                              v-if="formatted.to"
                              :href="formatted.to"
                              rel="noopener nofollow"
                              target="_blank"
                              >{{ formatted.text }}</a
                            >
                            <template v-else>
                              {{ formatted }}
                            </template>
                          </template>
                        </small>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-btn
            v-if="
              !['Complete', 'Failed', 'Insufficient'].includes(list.status) &&
              list.sampleFilename
            "
            :href="`${datasetsBaseUrl}${list.sampleFilename}`"
            class="mb-4"
            depressed
          >
            <v-icon left>{{ mdiDownload }}</v-icon>
            Download all samples
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <template #footer>
      <Logos />
    </template>

    <FaqDialog ref="faqDialog" topic="lists" />

    <v-dialog v-model="cancelDialog" max-width="400px" eager>
      <v-card>
        <v-card-title>Delete list</v-card-title>
        <v-card-text class="pb-0">
          <v-alert v-if="cancelError" type="error">
            {{ cancelError }}
          </v-alert>

          <div>The list will be deleted.</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="cancelDialog = false"
            >Cancel</v-btn
          >
          <v-btn :loading="cancelling" color="error" text @click="cancel"
            >Ok</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiArrowLeft,
  mdiDownload,
  mdiCreditCard,
  mdiPlus,
  mdiMinus,
  mdiCheckboxMarked,
  mdiPencil,
  mdiCart,
  mdiDelete,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Spinner from '~/components/Spinner.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Logos from '~/components/Logos.vue'
import FaqDialog from '~/components/FaqDialog.vue'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page,
    Spinner,
    TechnologyIcon,
    Logos,
    FaqDialog,
  },
  async asyncData({
    route,
    $axios,
    store: {
      state: {
        user: { isSignedIn },
      },
    },
  }) {
    if (isSignedIn) {
      const { id } = route.params

      const list = (await $axios.get(`lists/${id}`)).data

      return { list }
    }
  },
  data() {
    return {
      title: 'Lead list',
      checks: 0,
      datasetsBaseUrl: this.$config.DATASETS_BASE_URL,
      cancelDialog: false,
      cancelError: false,
      cancelling: false,
      error: false,
      mdiArrowLeft,
      mdiDownload,
      mdiCreditCard,
      mdiPlus,
      mdiMinus,
      mdiCheckboxMarked,
      mdiPencil,
      mdiCart,
      mdiDelete,
      panelIndex: 0,
      sidePanelIndex: 0,
      submitting: false,
      list: null,
      sets,
      status: '',
      technologiesViewAll: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
      isMember: ({ user }) =>
        !user.attrs.admin && user.impersonator && !user.impersonator.admin,
    }),
    technologies() {
      return this.list.query.matchAllTechnologies === 'not'
        ? this.list.query.technologies.slice(0, 1)
        : this.technologiesViewAll
        ? this.list.query.technologies
        : this.list.query.technologies.slice(0, 10)
    },
    queryParams() {
      if (!this.list) {
        return ''
      }

      const params = {
        attributes: this.list.query.requiredSets.length
          ? this.list.query.requiredSets
          : undefined,
        technologies: this.list.query.technologies.map(
          ({ slug, operator, version }) =>
            `${slug}${version ? `${operator}${version}` : ''}`
        ),
        tlds: this.list.query.tlds.length ? this.list.query.tlds : undefined,
        countries: this.list.query.geoIps.length
          ? this.list.query.geoIps.map(({ value }) => value)
          : undefined,
        languages: this.list.query.languages.length
          ? this.list.query.languages.map(({ value }) => value)
          : undefined,
        industries: this.list.query.industries.length
          ? this.list.query.industries.map(({ value }) => value)
          : undefined,
        subset:
          this.list.query.subset && this.list.query.subset !== 500000
            ? this.list.query.subset.toString()
            : undefined,
        traffic: this.list.query.subsetSlice
          ? this.list.query.subsetSlice.toString()
          : undefined,
        notraffic: this.list.query.excludeNoTraffic ? 'exclude' : undefined,
        min:
          this.list.query.minAge !== null && this.list.query.minAge !== 0
            ? this.list.query.minAge.toString()
            : undefined,
        max:
          this.list.query.maxAge !== null && this.list.query.maxAge !== 3
            ? this.list.query.maxAge.toString()
            : undefined,
        filters: this.list.query.matchAll ? 'and' : undefined,
        selection:
          this.list.query.matchAllTechnologies === 'and' ||
          this.list.query.matchAllTechnologies === 'not'
            ? this.list.query.matchAllTechnologies
            : undefined,
        contacts:
          this.list.query.compliance === 'exclude' ||
          this.list.query.compliance === 'excludeEU'
            ? this.list.query.compliance
            : undefined,
      }

      const string = Object.keys(params)
        .filter(
          (param) =>
            typeof params[param] !== 'undefined' &&
            params[param] !== '' &&
            params[param] !== null &&
            params[param].length <= 100
        )
        .map(
          (param) =>
            `${param}=${
              Array.isArray(params[param])
                ? params[param].join(',')
                : params[param]
            }`
        )
        .join('&')

      return string ? `?${string}` : ''
    },
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        const { id } = this.$route.params

        try {
          this.list = (await this.$axios.get(`lists/${id}`)).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
    list({ id, status, totalCredits }) {
      this.status = status

      if (status === 'Calculating') {
        setTimeout(async () => {
          this.checks += 1

          this.list = (await this.$axios.get(`lists/${id}`)).data
        }, Math.min(20000, 2000 + 100 * this.checks * this.checks))
      }
    },
  },

  methods: {
    totalRows(rows, matchAllTechnologies) {
      return matchAllTechnologies === 'or'
        ? Object.values(rows).reduce((total, rows) => total + rows, 0)
        : Object.values(rows)[0]
    },
    async submit() {
      this.error = false
      this.submitting = true

      if (this.list.orderId) {
        this.$router.push(`/orders/${this.list.orderId}`)

        return
      }

      try {
        const { id } = (
          await this.$axios.put('orders', {
            product: 'Lead list',
            listId: this.list.id,
          })
        ).data

        this.$router.push(`/orders/${id}`)
      } catch (error) {
        this.error = this.getErrorMessage(error)

        this.submitting = false
      }
    },
    async cancel() {
      this.cancelError = false
      this.cancelling = true
      this.success = false

      try {
        const { id } = this.$route.params

        await this.$axios.delete(`lists/${id}`)

        this.$router.push({ path: '/lists/all/' })
      } catch (error) {
        this.cancelError = this.getErrorMessage(error)
      }

      this.cancelling = false
    },
  },
}
</script>

<style>
.no-x-padding .v-expansion-panel-content__wrap {
  padding-left: 0;
  padding-right: 0;
}

.no-b-padding .v-expansion-panel-content__wrap {
  padding-bottom: 0;
}

.no-x-padding th:first-child,
.no-x-padding td:first-child {
  padding-left: 24px !important;
}

.no-x-padding th:last-child,
.no-x-padding td:last-child {
  padding-right: 24px !important;
}
</style>
