<template>
  <Page
    :title="title"
    :crumbs="[{ title: 'Lead lists', to: '/lists/all/' }]"
    :loading="!list && !error"
    secure
    no-side-bar
  >
    <v-alert v-if="error" type="error" class="mb-8" text>
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
              color="success"
              :href="`${datasetsBaseUrl}${list.filename}`"
              x-large
              depressed
            >
              <v-icon left size="20">
                {{ mdiDownload }}
              </v-icon>
              Download list
            </v-btn>
          </div>

          <v-card
            v-if="!list.pro && !isPro"
            color="primary lighten-1 primary--text"
            class="mb-4"
            flat
          >
            <v-card-title class="subtitle-2">
              <v-icon color="primary" size="20" left>
                {{ mdiLockOpenVariantOutline }}
              </v-icon>
              Unlock pro features
            </v-card-title>
            <v-card-text class="primary--text pb-0">
              Subscribe to a
              <v-chip to="/pro/" color="primary" x-small outlined> PRO </v-chip>
              plan to include company and contact information in lead lists.
            </v-card-text>
            <v-card-actions>
              <v-spacer />

              <v-btn to="/pricing/" color="primary" text>
                Compare plans
                <v-icon right>
                  {{ mdiArrowRight }}
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card v-if="list.status === 'Ready'" class="mb-4">
            <v-card-text class="px-0">
              <v-simple-table class="mb-4">
                <tbody>
                  <tr>
                    <th width="40%">Websites</th>
                    <td>
                      {{
                        formatNumber(
                          totalRows(
                            list.rows || 0,
                            list.query.matchAllTechnologies
                          )
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
                      <template
                        v-if="list.pro || isPro || credits >= list.totalCredits"
                      >
                        {{ formatNumber(list.totalCredits) }} credits
                        <span v-if="isPro" class="text--disabled"
                          >(or {{ formatCurrency(list.total / 100) }})</span
                        >
                      </template>
                      <template v-else>
                        {{ formatCurrency(list.total / 100) }}
                        <span class="text--disabled"
                          >(or
                          {{ formatNumber(list.totalCredits) }} credits)</span
                        >
                      </template>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>

              <div class="d-flex flex-column align-stretch mx-4">
                <template v-if="list.pro && !isPro">
                  <v-alert color="primary" text
                    ><small
                      >PRO fields are included. Sign up for an eligible plan to
                      download the full list.</small
                    ></v-alert
                  >

                  <v-btn to="/pricing/" color="primary" x-large depressed>
                    Plans &amp; pricing
                    <v-icon right size="20">
                      {{ mdiArrowRight }}
                    </v-icon>
                  </v-btn>
                </template>
                <v-btn
                  v-else
                  color="success"
                  x-large
                  depressed
                  :loading="submitting"
                  @click="submit"
                >
                  <v-icon left size="20">
                    {{ mdiCart }}
                  </v-icon>
                  Checkout
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <v-switch
            v-if="
              !list.repeatListId && ['Ready', 'Complete'].includes(list.status)
            "
            v-model="repeat"
            :loading="repeating"
            :disabled="list.pro && !isPro"
            class="my-6 pt-0"
            inset
            hide-details
          >
            <template #label>
              Recreate weekly with new websites
              <v-tooltip max-width="300" left>
                <template #activator="{ on }">
                  <sup>
                    <v-icon class="ml-1" small v-on="on">{{
                      mdiHelpCircleOutline
                    }}</v-icon>
                  </sup>
                </template>

                Automatically recreate this list every week, with only newly
                discovered websites.<br /><br />

                Costs 1 credit per website. Subscribe to a plan to get monthly
                credits.
              </v-tooltip>
            </template>
          </v-switch>

          <v-expansion-panels v-model="sidePanelIndex" class="mb-4">
            <v-expansion-panel v-if="technologies.length">
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
                          <v-chip
                            v-if="technology.operator && technology.version"
                            class="ml-2"
                            small
                            label
                            outlined
                          >
                            {{ technology.operator }} v{{ technology.version }}
                          </v-chip>
                        </div>
                      </td>
                      <td
                        v-if="['Insufficient', 'Failed'].includes(list.status)"
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
                    <v-icon small left text>
                      {{ technologiesViewAll ? mdiMinus : mdiPlus }}
                    </v-icon>
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

            <v-expansion-panel v-if="list.query.keywords.length">
              <v-expansion-panel-header class="subtitle-2">
                Keywords
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-chip-group column>
                  <v-chip
                    v-for="keyword in list.query.keywords"
                    :key="keyword"
                    color="primary lighten-1 primary--text"
                    label
                  >
                    {{ keyword }}
                  </v-chip>
                </v-chip-group>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header class="subtitle-2">
                Filters
              </v-expansion-panel-header>
              <v-expansion-panel-content class="no-x-padding">
                <v-simple-table>
                  <tbody>
                    <tr
                      v-if="
                        list.query.industries && list.query.industries.length
                      "
                    >
                      <th width="40%">Industries</th>
                      <td>
                        <v-chip-group class="my-2" column>
                          <v-chip
                            v-for="industry in list.query.industries"
                            :key="industry"
                            outlined
                            small
                            label
                          >
                            {{ industry }}
                          </v-chip>
                        </v-chip-group>
                      </td>
                    </tr>
                    <tr
                      v-if="
                        list.query.companySizes &&
                        list.query.companySizes.length
                      "
                    >
                      <th width="40%">Company sizes</th>
                      <td>
                        <v-chip-group class="my-2" column>
                          <v-chip
                            v-for="{ value, text } in list.query.companySizes"
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
                        <template v-if="list.query.technologies.length">
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
                        </template>
                      </td>
                    </tr>
                    <tr
                      v-if="
                        list.query.technologies.length &&
                        list.query.excludeNoTraffic
                      "
                    >
                      <th width="40%">Exclude websites without traffic data</th>
                      <td>
                        <v-icon color="primary">
                          {{ mdiCheckboxMarked }}
                        </v-icon>
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
                          >
                            {{ tld }}
                          </v-chip>
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
                    <tr
                      v-if="
                        list.query.languages.length &&
                        list.query.excludeMultilingual
                      "
                    >
                      <th width="40%">Exclude multilingual</th>
                      <td>
                        <v-icon color="primary">
                          {{ mdiCheckboxMarked }}
                        </v-icon>
                      </td>
                    </tr>
                    <tr v-if="list.query.matchAll">
                      <th width="40%">Match IP country and language</th>
                      <td>
                        <v-icon color="primary">
                          {{ mdiCheckboxMarked }}
                        </v-icon>
                      </td>
                    </tr>
                    <tr v-if="list.query.technologies.length">
                      <th width="40%">Freshness</th>
                      <td>
                        {{ list.query.minAge || 0 }}-{{
                          list.query.maxAge || 3
                        }}
                        months
                      </td>
                    </tr>
                    <tr v-if="list.exclusionsFilename">
                      <th width="40%">Exclusions</th>
                      <td>
                        <v-btn
                          :href="`${datasetsBaseUrl}${list.exclusionsFilename}`"
                          color="accent"
                          icon
                        >
                          <v-icon>{{ mdiDownload }}</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                    <tr v-if="list.query.requiredSets.length">
                      <th width="40%">Required</th>
                      <td>
                        <div v-for="key in list.query.requiredSets" :key="key">
                          {{
                            (set =
                              sets.find(({ key: _key }) => _key === key) ||
                              {}) && null
                          }}
                          {{
                            (set.name || key).charAt(0).toUpperCase() +
                            (set.name || key).substring(1)
                          }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header class="subtitle-2">
                Fields
              </v-expansion-panel-header>
              <v-expansion-panel-content class="no-x-padding">
                <v-alert
                  v-if="
                    list.query.compliance === 'exclude' ||
                    list.query.compliance === 'excludeEU'
                  "
                  color="warning"
                  class="mx-6 pb-3"
                  border="left"
                  dense
                  text
                >
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
                      <th>Field set</th>
                      <th class="text-right">Results</th>
                    </tr>
                    <v-tooltip
                      v-for="set in sets.filter(
                        ({ key }) =>
                          key === 'base-list' || list.sets.includes(key)
                      )"
                      :key="set.key"
                      max-width="200"
                      left
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
                                        list.rows || 0,
                                        list.query.matchAllTechnologies
                                      )
                                    : list.setRows
                                    ? list.setRows[set.key] || 0
                                    : 0
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

          <v-card-actions class="mb-4 pa-0 d-flex">
            <v-btn small depressed @click="$refs.faqDialog.open()">
              <v-icon left>
                {{ mdiForum }}
              </v-icon>
              FAQs
            </v-btn>
            <v-spacer />
            <v-btn :to="`/lists/${queryParams}`" color="accent" text small>
              <v-icon left>
                {{ mdiPencil }}
              </v-icon>
              Edit
            </v-btn>
            <v-btn
              v-if="list.status !== 'Complete'"
              color="error"
              class="ml-2"
              text
              small
              @click="cancelDialog = true"
            >
              <v-icon left>
                {{ mdiDelete }}
              </v-icon>
              Delete
            </v-btn>
          </v-card-actions>
        </v-col>

        <v-col cols="12" md="8" class="py-0">
          <v-alert
            v-if="list.status === 'Calculating'"
            :icon="mdiTimerSandEmpty"
            color="accent"
            border="left"
            text
            prominent
          >
            Your list is being created. This may take a few minutes, we'll send
            you an email when it's ready.
          </v-alert>

          <v-alert
            v-if="list.status === 'Failed'"
            :icon="mdiAlertOctagonOutline"
            type="error"
            border="left"
            text
            prominent
          >
            Sorry, something went wrong during the processing of your list.
            Please contact us.
          </v-alert>

          <v-alert
            v-if="list.status === 'Insufficient'"
            :icon="mdiEmoticonSadOutline"
            color="warning"
            border="left"
            text
            prominent
          >
            <p>
              Sorry, we don't have results available matching your requirements.
              Please try it again with different or no filters.
            </p>

            <v-btn :to="`/lists/${queryParams}`" color="warning" exact outlined>
              <v-icon left>
                {{ mdiArrowLeft }}
              </v-icon>
              Create a new list
            </v-btn>
          </v-alert>

          <v-alert
            v-if="list.status === 'Ready'"
            type="success"
            color="accent"
            border="left"
            text
            prominent
          >
            Your list is ready. Please review the samples and availability.
          </v-alert>

          <v-alert
            v-if="list.status === 'Complete' && list.repeatListId"
            :icon="mdiUpdate"
            type="success"
            color="accent"
            border="left"
            text
            prominent
          >
            This is an automatically created weekly update for the list
            <nuxt-link :to="`/lists/${list.repeatListId}`">{{
              list.repeatListId
            }}</nuxt-link
            >.
          </v-alert>

          <v-alert
            v-else-if="list.status === 'Complete'"
            type="success"
            border="left"
            text
            prominent
          >
            Thank you for your payment, your list is ready.
          </v-alert>

          <div
            v-if="list.status === 'Calculating'"
            class="text-center mb-n6"
            style="padding: 100px 0"
          >
            <v-progress-circular
              size="100"
              width="5"
              style="opacity: 0.2"
              indeterminate
            />
          </div>

          <template v-if="['Ready', 'Complete'].includes(list.status)">
            <v-expansion-panels
              v-if="list.query.technologies.length"
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
                      <span
                        ><v-chip class="ml-2" small label outlined
                          >sample</v-chip
                        ></span
                      >
                    </div>
                  </template>
                  <div v-else class="d-flex align-center">
                    <TechnologyIcon :icon="technology.icon" />
                    {{ technology.name }}
                    <span
                      ><v-chip class="ml-2" small label outlined
                        >sample</v-chip
                      ></span
                    >
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="no-x-padding no-b-padding">
                  <ListSample :sample="technology.sample" />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-card v-else class="mb-6">
              <v-card-title>Sample</v-card-title>
              <v-card-text class="px-0 pb-0">
                <ListSample :sample="list.query.sample" />
              </v-card-text>
            </v-card>
          </template>

          <v-btn
            v-if="
              !['Complete', 'Failed', 'Insufficient'].includes(list.status) &&
              list.sampleFilename
            "
            :href="`${datasetsBaseUrl}${list.sampleFilename}`"
            class="mb-4"
            depressed
          >
            <v-icon left>
              {{ mdiDownload }}
            </v-icon>
            Download samples
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
        <v-card-text>
          <v-alert v-if="cancelError" type="error" text>
            {{ cancelError }}
          </v-alert>

          <div>The list will be deleted.</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="cancelDialog = false">
            Cancel
          </v-btn>
          <v-btn :loading="cancelling" color="error" text @click="cancel">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="repeatDialog" max-width="600px" eager>
      <v-card>
        <v-card-title>Weekly updates enabled</v-card-title>
        <v-card-text>
          <p>
            This list will be recreated with newly discovered domains every
            week.
          </p>

          <p class="mb-0">
            The lists will be paid for automatically using your credit balance.
            If you have insufficient credits, this feature is turned off
            automatically.
            <nuxt-link to="/pricing/"> Subscribe to a plan </nuxt-link> to get
            monthly credits.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="repeatDialog = false"> Ok </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
  mdiForum,
  mdiHelpCircleOutline,
  mdiUpdate,
  mdiLockOpenVariantOutline,
  mdiArrowRight,
  mdiEmoticonSadOutline,
  mdiAlertOctagonOutline,
  mdiTimerSandEmpty,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Spinner from '~/components/Spinner.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Logos from '~/components/Logos.vue'
import FaqDialog from '~/components/FaqDialog.vue'
import ListSample from '~/components/ListSample.vue'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page,
    Spinner,
    TechnologyIcon,
    Logos,
    FaqDialog,
    ListSample,
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

      const repeat = !!list.repeat

      return { list, repeat }
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
      mdiForum,
      mdiHelpCircleOutline,
      mdiUpdate,
      mdiLockOpenVariantOutline,
      mdiArrowRight,
      mdiEmoticonSadOutline,
      mdiTimerSandEmpty,
      mdiAlertOctagonOutline,
      panelIndex: 0,
      repeat: false,
      repeatDialog: false,
      repeating: false,
      sidePanelIndex: 0,
      submitting: false,
      list: null,
      sets,
      technologiesViewAll: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isPro: ({ credits }) => credits.pro,
      isSignedIn: ({ user }) => user.isSignedIn,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
      isMember: ({ user }) =>
        !user.attrs.admin && user.impersonator && !user.impersonator.admin,
      credits: ({ credits: { credits } }) => credits,
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
        technologies: this.list.query.technologies.length
          ? this.list.query.technologies.map(
              ({ slug, operator, version }) =>
                `${slug}${version ? `${operator}${version}` : ''}`
            )
          : undefined,
        keywords: this.list.query.keywords.length
          ? this.list.query.keywords
          : undefined,
        tlds: this.list.query.tlds.length ? this.list.query.tlds : undefined,
        countries: this.list.query.geoIps.length
          ? this.list.query.geoIps.map(({ value }) => value)
          : undefined,
        languages: this.list.query.languages.length
          ? this.list.query.languages.map(({ value }) => value)
          : undefined,
        industries: this.list.query.industries.length
          ? this.list.query.industries
          : undefined,
        sizes: this.list.query.companySizes.length
          ? this.list.query.companySizes.map(({ value }) => value)
          : undefined,
        subset:
          this.list.query.subset && this.list.query.subset !== 500000
            ? this.list.query.subset.toString()
            : undefined,
        traffic: this.list.query.subsetSlice
          ? this.list.query.subsetSlice.toString()
          : undefined,
        notraffic: this.list.query.excludeNoTraffic ? 'exclude' : undefined,
        multilingual: this.list.query.excludeMultilingual
          ? 'exclude'
          : undefined,
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
          this.isPro &&
          (this.list.query.compliance === 'exclude' ||
            this.list.query.compliance === 'excludeEU')
            ? this.list.query.compliance
            : undefined,
        pro: !this.isPro && this.list.pro ? '1' : undefined,
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
    async isSignedIn() {
      if (this.isSignedIn) {
        const { id } = this.$route.params

        try {
          this.getCredits()

          this.list = (await this.$axios.get(`lists/${id}`)).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
    list({ id, status }) {
      if (status === 'Calculating') {
        setTimeout(async () => {
          this.checks += 1

          this.list = (await this.$axios.get(`lists/${id}`)).data
        }, Math.min(10000, 2000 + 100 * this.checks * this.checks))
      }
    },
    repeat() {
      this.toggleRepeat()
    },
  },
  mounted() {
    if (this.list) {
      this.list = { ...this.list }
    }
  },
  created() {
    if (this.isSignedIn) {
      this.getCredits()
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
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
    async toggleRepeat() {
      this.error = false
      this.repeating = true

      try {
        await this.$axios.patch(`lists/${this.list.id}`, {
          repeat: this.repeat,
        })

        if (this.repeat) {
          this.repeatDialog = true
        }
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.repeating = false
    },
  },
}
</script>
