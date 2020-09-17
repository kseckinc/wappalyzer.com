<template>
  <div>
    <Page :title="title" :head="meta">
      <p>
        Get started by selecting one or more technologies. Optionally add
        additional attributes, filters and limits to customise your list. An
        obligation free quote will be created and your list is available
        immediately upon completing the order.
      </p>

      <v-btn
        color="accent"
        class="mt-4 mb-8"
        outlined
        @click="$refs.pricingDialog.open()"
      >
        <v-icon left>{{ mdiCalculator }}</v-icon>
        Pricing
      </v-btn>

      <v-btn color="accent" href="/list-sample.zip" class="mt-4 mb-8" outlined>
        <v-icon left>{{ mdiDownload }}</v-icon>
        Sample list
      </v-btn>

      <v-btn color="accent" to="/faq/lists/" class="mt-4 mb-8" outlined>
        <v-icon left>{{ mdiForum }}</v-icon>
        FAQs
      </v-btn>

      <template v-slot:content>
        <h2 class="mb-4">Create your list</h2>

        <v-card class="mb-4" color="secondary">
          <v-card-text v-if="error">
            <v-alert type="error">
              {{ error }}
            </v-alert>
          </v-card-text>
          <v-row>
            <v-col class="py-0 pr-sm-0" cols="12" sm="6">
              <v-card-title>
                <v-icon color="primary" left>{{ mdiFormatListChecks }}</v-icon>
                Selection
              </v-card-title>
              <v-card-text>
                <v-card>
                  <v-card-title class="subtitle-2">
                    Technologies
                  </v-card-title>
                  <v-card-text>
                    <p>
                      Choose one or more technologies to include.
                    </p>

                    <Technologies ref="selector" @select="selectItem" />
                  </v-card-text>
                  <v-card-text class="px-0 pt-0 mt-n4">
                    <v-simple-table>
                      <tbody>
                        <tr v-for="item in selectedItems" :key="item.slug">
                          <td>
                            <div
                              v-if="item.type === 'technology'"
                              class="d-flex align-center py-2"
                            >
                              <TechnologyIcon :icon="item.icon" />
                              <span>{{ item.name }}</span>
                            </div>
                            <v-row v-else>
                              <v-col>
                                {{ item.name }}
                              </v-col>
                              <v-col class="text-right">
                                <small
                                  >{{
                                    item.technologiesCount
                                  }}
                                  technologies</small
                                >
                              </v-col>
                            </v-row>
                          </td>
                          <td width="1">
                            <v-btn icon @click="removeItem(item)">
                              <v-icon>{{ mdiCloseCircleOutline }}</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </v-card-text>

              <v-card-text>
                <v-card>
                  <v-card-title class="subtitle-2">
                    Attribute sets
                  </v-card-title>
                  <v-card-text class="px-0">
                    <p class="px-4">
                      Choose one or more
                      <nuxt-link to="/docs/sets/" target="_blank"
                        >attribute sets</nuxt-link
                      >
                      to include. Limited availability.
                    </p>
                    <v-simple-table dense>
                      <tbody>
                        <tr
                          v-for="set in sets.filter(
                            ({ key }) => key !== 'base-lookup'
                          )"
                          :key="set.key"
                        >
                          <td>
                            <v-row class="px-2" align="center">
                              <v-checkbox
                                v-model="set.value"
                                :disabled="set.disabled"
                                class="mt-0 shrink"
                                dense
                                hide-details
                              >
                                <template v-slot:label>
                                  <small>
                                    {{ set.name }}
                                  </small>
                                </template>
                              </v-checkbox>
                              <v-tooltip :key="set.key" top>
                                <template v-slot:activator="{ on }">
                                  <v-icon small class="ml-1" v-on="on">{{
                                    mdiInformationOutline
                                  }}</v-icon>
                                </template>

                                {{
                                  set.attributes
                                    .map(({ name, key }) => name || key)
                                    .join(', ')
                                }}
                              </v-tooltip>
                            </v-row>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </v-card-text>

              <v-card-title>
                <v-icon color="primary" left>{{
                  mdiArrowCollapseVertical
                }}</v-icon>
                Limits <span class="grey--text ml-1">(optional)</span>
              </v-card-title>
              <v-card-text>
                <v-card class="mb-8">
                  <v-card-title class="subtitle-2">
                    Subset
                  </v-card-title>
                  <v-card-text>
                    <p>
                      Limit results to a number of top traficked websites per
                      technology.
                    </p>

                    <v-text-field
                      v-model="subset"
                      :rules="[
                        (v) =>
                          !v || /^[0-9]+$/.test(v) || 'Value must be numeric',
                        (v) =>
                          !v || v >= 500 || 'Subset size must be at least 500',
                      ]"
                      class="mb-4"
                      placeholder="5000"
                      hide-details="auto"
                    />
                  </v-card-text>
                </v-card>

                <v-card>
                  <v-card-title class="subtitle-2">
                    Exclusions
                  </v-card-title>
                  <v-card-text>
                    <p>
                      Upload a .txt file with domain names to exclude, each on a
                      new line.
                    </p>

                    <v-file-input
                      :error-messages="fileErrors"
                      placeholder="Select a file..."
                      accept="text/plain"
                      hide-details="auto"
                      class="mb-4"
                      @change="fileChange"
                    />
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-col>
            <v-col class="py-0 pl-sm-0" cols="12" sm="6">
              <v-card-title>
                <v-icon color="primary" left>{{ mdiFilterOutline }}</v-icon>
                Filters <span class="grey--text ml-1">(optional)</span>
              </v-card-title>
              <v-card-text>
                <v-card class="mb-8">
                  <v-card-title class="subtitle-2">
                    IP countries
                  </v-card-title>
                  <v-card-text>
                    <p>
                      Target countries by website IP address.
                    </p>

                    <v-select
                      ref="country"
                      :items="geoIps"
                      class="mb-4"
                      label="Select a country"
                      hide-details
                      eager
                    >
                      <template v-slot:item="{ item }">
                        <v-list-item ripple @click="toggleGeoIp(item)">
                          <v-list-item-action>
                            <v-icon :color="item.active ? 'primary' : ''">{{
                              item.active
                                ? mdiCheckboxMarked
                                : mdiCheckboxBlankOutline
                            }}</v-icon>
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-row class="align-center">
                              <v-col class="py-0">
                                {{ item.text }}
                              </v-col>
                              <v-col
                                class="py-0 nowrap text-right body-2 flex-grow-0"
                              >
                                {{ item.value }}
                              </v-col>
                            </v-row>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>

                    <v-chip-group
                      v-if="selected.geoIps.length"
                      class="mt-n1 mb-2"
                      column
                    >
                      <v-tooltip
                        v-for="(item, i) in selected.geoIps"
                        :key="i"
                        bottom
                      >
                        <template v-slot:activator="{ on }">
                          <v-chip
                            color="primary"
                            outlined
                            close
                            v-on="on"
                            @click:close="toggleGeoIp(item)"
                          >
                            {{ item.value }}
                          </v-chip>
                        </template>

                        {{
                          item.parent && item.parent !== item.text
                            ? `${item.parent} (${item.text})`
                            : item.text
                        }}
                      </v-tooltip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>

                <v-card class="mb-8">
                  <v-card-title class="subtitle-2">
                    Top-level domains
                  </v-card-title>
                  <v-card-text>
                    <p>
                      Target countries by top-level domain.<sup
                        ><a
                          href="https://en.wikipedia.org/wiki/Top-level_domain"
                          target="_blank"
                          ><v-icon color="accent" small>{{
                            mdiHelpBox
                          }}</v-icon></a
                        ></sup
                      >
                    </p>

                    <v-row>
                      <v-col class="py-0">
                        <v-select
                          ref="country"
                          v-model="selectedCountry"
                          :items="countries"
                          class="mb-4"
                          label="Select a country"
                          hide-details
                          eager
                        />
                      </v-col>
                      <v-col class="py-0">
                        <v-form ref="form" @submit.prevent="addTld">
                          <v-text-field
                            v-model="tld"
                            :error-messages="tldErrors"
                            :append-icon="mdiPlus"
                            placeholder=".com"
                            hide-details="auto"
                            @click:append="addTld"
                          />
                        </v-form>
                      </v-col>
                    </v-row>

                    <v-select
                      v-if="selectedCountry"
                      ref="tld"
                      :items="tlds"
                      class="mb-8"
                      label="Select a top-level-domain"
                      hide-details
                      eager
                    >
                      <template v-slot:prepend-item>
                        <v-list-item ripple @click="toggleTlds">
                          <v-list-item-action>
                            <v-icon
                              :color="selected.tlds.length > 0 ? 'primary' : ''"
                              >{{
                                tlds.every(({ active }) => active)
                                  ? mdiCheckboxMarked
                                  : tlds.some(({ active }) => active)
                                  ? mdiMinusBoxOutline
                                  : mdiCheckboxBlankOutline
                              }}</v-icon
                            >
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-list-item-title>Select All</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-divider class="mt-2"></v-divider>
                      </template>

                      <template v-slot:item="{ item }">
                        <v-list-item ripple @click="toggleTld(item)">
                          <v-list-item-action>
                            <v-icon :color="item.active ? 'primary' : ''">{{
                              item.active
                                ? mdiCheckboxMarked
                                : mdiCheckboxBlankOutline
                            }}</v-icon>
                          </v-list-item-action>

                          <v-list-item-content>
                            {{ item.text }}
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>

                    <v-chip-group
                      v-if="selected.tlds.length"
                      class="mt-n1 mb-4"
                      column
                    >
                      <v-tooltip
                        v-for="(item, i) in selected.tlds"
                        :key="i"
                        bottom
                      >
                        <template v-slot:activator="{ on }">
                          <v-chip
                            color="primary"
                            outlined
                            close
                            v-on="item.parent ? on : undefined"
                            @click:close="toggleTld(item)"
                          >
                            {{ item.value }}
                          </v-chip>
                        </template>

                        {{ item.parent }}
                      </v-tooltip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>

                <v-card class="mb-8">
                  <v-card-title class="subtitle-2">
                    Languages
                  </v-card-title>
                  <v-card-text>
                    <p>
                      Target websites using specific languages.
                    </p>

                    <v-select
                      ref="language"
                      v-model="selectedLanguage"
                      :items="languages"
                      class="mb-4"
                      label="Select a language"
                      hide-details
                      eager
                    >
                      <template v-slot:item="{ item }">
                        <v-list-item ripple @click="toggleLanguage(item)">
                          <v-list-item-action>
                            <v-icon :color="item.active ? 'primary' : ''">{{
                              typeof item.value === 'object'
                                ? mdiDotsHorizontal
                                : item.active
                                ? mdiCheckboxMarked
                                : mdiCheckboxBlankOutline
                            }}</v-icon>
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-row class="align-center">
                              <v-col class="py-0">
                                {{ item.text }}
                              </v-col>
                              <v-col
                                class="py-0 nowrap text-right body-2 flex-grow-0"
                              >
                                {{
                                  typeof item.value === 'object'
                                    ? item.value[Object.keys(item.value)[0]]
                                    : item.value
                                }}
                              </v-col>
                            </v-row>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>

                    <v-select
                      v-if="variants"
                      ref="variant"
                      :items="variants"
                      class="mb-4"
                      label="Select a language country"
                      hide-details
                      eager
                    >
                      <template v-slot:prepend-item>
                        <v-list-item ripple @click="toggleVariants">
                          <v-list-item-action>
                            <v-icon
                              :color="
                                selected.languages.length > 0 ? 'primary' : ''
                              "
                              >{{
                                variants.every(({ active }) => active)
                                  ? mdiCheckboxMarked
                                  : variants.some(({ active }) => active)
                                  ? mdiMinusBoxOutline
                                  : mdiCheckboxBlankOutline
                              }}</v-icon
                            >
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-list-item-title>Select All</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-divider class="mt-2"></v-divider>
                      </template>

                      <template v-slot:item="{ item }">
                        <v-list-item ripple @click="toggleVariant(item)">
                          <v-list-item-action>
                            <v-icon :color="item.active ? 'primary' : ''">{{
                              item.active
                                ? mdiCheckboxMarked
                                : mdiCheckboxBlankOutline
                            }}</v-icon>
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-row class="align-center">
                              <v-col class="py-0">
                                {{ item.text }}
                              </v-col>
                              <v-col
                                class="py-0 nowrap text-right body-2 flex-grow-0"
                                >{{ item.value }}</v-col
                              >
                            </v-row>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>

                    <v-chip-group
                      v-if="selected.languages.length"
                      class="mt-n1 mb-2"
                      column
                    >
                      <v-tooltip
                        v-for="(item, i) in selected.languages"
                        :key="i"
                        bottom
                      >
                        <template v-slot:activator="{ on }">
                          <v-chip
                            color="primary"
                            outlined
                            close
                            v-on="on"
                            @click:close="toggleVariant(item)"
                          >
                            {{ item.value }}
                          </v-chip>
                        </template>

                        {{
                          item.parent && item.parent !== item.text
                            ? `${item.parent} (${item.text})`
                            : item.text
                        }}
                      </v-tooltip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>

                <v-checkbox
                  v-model="matchAll"
                  class="mb-4"
                  label="Match all filters (yields fewer results)"
                  hide-details
                ></v-checkbox>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <v-btn
          :disabled="!selectedItems.length"
          color="primary"
          class="mt-4 mb-4"
          large
          @click="submit()"
          >Get a quote <v-icon right>{{ mdiArrowRight }}</v-icon>
        </v-btn>

        <p class="mb-8">
          <small>
            By using our services, you agree to our
            <nuxt-link to="/terms/" target="_blank">terms of service</nuxt-link
            >.
          </small>
        </p>
      </template>

      <v-dialog v-model="confirmDialog" max-width="500px">
        <v-card>
          <v-card-title>
            No filters or limits specified
          </v-card-title>
          <v-card-text class="pb-0">
            This list could be very large. Specify a subset to only include the
            top traficked websites or add a filter to narrow down the results.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="confirmDialog = false"
              >Return to form</v-btn
            >
            <v-btn color="accent" text @click="submit(true)"
              >Continue anyway</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="signInDialog" max-width="400px">
        <SignIn mode-continue mode-sign-up />
      </v-dialog>

      <OrderDialog
        :id="order ? order.id : null"
        ref="orderDialog"
        :error="orderError"
        @close="orderDialog = false"
      />

      <PricingDialog ref="pricingDialog" product="list" />

      <template v-slot:footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import {
  mdiCalculator,
  mdiDownload,
  mdiForum,
  mdiFormatListChecks,
  mdiCloseCircleOutline,
  mdiInformationOutline,
  mdiCheckboxMarked,
  mdiCheckboxBlankOutline,
  mdiMinusBoxOutline,
  mdiDotsHorizontal,
  mdiHelpBox,
  mdiPlus,
  mdiArrowRight,
  mdiFilterOutline,
  mdiArrowCollapseVertical,
} from '@mdi/js'
import Page from '~/components/Page.vue'
import Technologies from '~/components/Technologies.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Logos from '~/components/Logos.vue'
import SignIn from '~/components/SignIn.vue'
import OrderDialog from '~/components/OrderDialog.vue'
import PricingDialog from '~/components/PricingDialog.vue'
import { lists as meta } from '~/assets/json/meta.json'
import languages from '~/assets/json/languages.json'
import tlds from '~/assets/json/tlds.json'
import countries from '~/assets/json/countries.json'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page,
    Technologies,
    TechnologyIcon,
    Logos,
    SignIn,
    OrderDialog,
    PricingDialog,
  },
  data() {
    return {
      title: meta.title,
      countries: Object.keys(tlds),
      confirmDialog: false,
      error: false,
      file: '',
      fileErrors: [],
      matchAll: false,
      mdiCalculator,
      mdiDownload,
      mdiForum,
      mdiFormatListChecks,
      mdiCloseCircleOutline,
      mdiInformationOutline,
      mdiCheckboxMarked,
      mdiCheckboxBlankOutline,
      mdiMinusBoxOutline,
      mdiDotsHorizontal,
      mdiHelpBox,
      mdiPlus,
      mdiArrowRight,
      mdiFilterOutline,
      mdiArrowCollapseVertical,
      meta,
      signInDialog: false,
      selectedCountry: '',
      selectedLanguage: {},
      selected: {
        categories: [],
        technologies: [],
        geoIps: [],
        tlds: [],
        languages: [],
      },
      sets,
      subset: null,
      order: false,
      orderError: '',
      ordering: false,
      tld: '',
      tldErrors: [],
      languages: Object.keys(languages).reduce(
        (list, text) => [...list, { text, value: languages[text] }],
        []
      ),
    }
  },
  computed: {
    selectedItems() {
      return [...this.selected.categories, ...this.selected.technologies]
    },
    variants() {
      if (typeof this.selectedLanguage.value === 'object') {
        return Object.keys(this.selectedLanguage.value).reduce(
          (list, text) => [
            ...list,
            {
              text,
              parent: this.selectedLanguage.text,
              value: this.selectedLanguage.value[text],
            },
          ],
          []
        )
      } else {
        return false
      }
    },
    tlds() {
      return tlds[this.selectedCountry].map((tld) => ({
        text: tld,
        active: this.selected.tlds.some(({ value }) => value === tld),
        parent: this.selectedCountry,
        value: tld,
      }))
    },
    geoIps() {
      return countries.map(({ value, text }) => ({
        text,
        active: this.selected.geoIps.some(
          ({ value: _value }) => _value === value
        ),
        value,
      }))
    },
  },
  watch: {
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn && this.ordering) {
        this.signInDialog = false

        this.submit()
      }
    },
    selectedCountry() {
      this.$nextTick(() => {
        this.$watch('$refs.tld.isMenuActive', (active) => {
          if (!active) {
            this.selectedCountry = ''

            this.$refs.country.blur()
          }
        })
      })
    },
  },
  async created() {
    const { categorySlug, technologySlug } = this.$store.state.lists

    if (categorySlug) {
      if (technologySlug) {
        try {
          const { slug, name, icon } = (
            await this.$axios.get(`technologies/${technologySlug}`)
          ).data

          this.selected.technologies.push({
            type: 'technology',
            slug,
            name,
            icon,
          })
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      } else {
        try {
          const { slug, name, technologies } = (
            await this.$axios.get(`categories/${categorySlug}`)
          ).data

          this.selected.categories.push({
            type: 'category',
            slug,
            name,
            technologiesCount: Object.keys(technologies).length,
          })
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    }

    this.$store.commit('lists/setTechnologySlug', false)
    this.$store.commit('lists/setCategorySlug', false)
  },
  methods: {
    async submit(confirmed = false) {
      this.orderError = ''
      this.ordering = true

      if (!this.$store.state.user.isSignedIn) {
        this.signInDialog = true

        return
      }

      const totalHostnames = this.selected.technologies.reduce(
        (sum, { hostnames }) => sum + hostnames,
        0
      )

      if (
        !confirmed &&
        (totalHostnames > 100000 || this.selected.categories.length) &&
        !this.selected.languages.length &&
        !this.selected.geoIps.length &&
        !this.selected.tlds.length &&
        !this.subset
      ) {
        this.confirmDialog = true

        return
      } else {
        this.confirmDialog = false
      }

      this.$refs.orderDialog.open()

      try {
        this.order = (
          await this.$axios.put('orders', {
            product: 'Lead list',
            dataset: {
              query: {
                technologies: this.selected.technologies.map(
                  ({ slug, name, icon, categories }) => ({
                    slug,
                    name,
                    icon,
                    categories,
                  })
                ),
                categories: this.selected.categories.map(({ slug, name }) => ({
                  slug,
                  name,
                })),
                languages: this.selected.languages.map(
                  ({ text, parent, value }) => ({
                    text:
                      parent && parent !== text ? `${parent} (${text})` : text,
                    value,
                  })
                ),
                geoIps: this.selected.geoIps.map(({ value, text }) => ({
                  value,
                  text,
                })),
                tlds: this.selected.tlds.map(({ value }) => value),
                matchAll: this.matchAll,
                subset: this.subset,
              },
              sets: this.sets
                .filter(({ disabled, value }) => value && !disabled)
                .map(({ key }) => key),
              exclusions: this.file,
            },
          })
        ).data
      } catch (error) {
        this.orderError = this.getErrorMessage(error)
      }

      this.ordering = false
    },
    selectItem(item) {
      item.active = true

      if (item.type === 'technology') {
        this.selected.technologies.push(item)
      } else {
        this.selected.categories.push(item)
      }

      this.categories = this.selected.categories.filter(
        ({ slug }, index) =>
          this.selected.categories.findIndex(
            (category) => slug === category.slug
          ) === index
      )

      this.selected.technologies = this.selected.technologies.filter(
        ({ slug, categories }, index) =>
          this.selected.technologies.findIndex(
            (technology) => slug === technology.slug
          ) === index &&
          !categories.some(({ slug }) =>
            this.selected.categories.some((category) => slug === category.slug)
          )
      )

      this.$refs.selector.clear()
    },
    removeItem(item) {
      item.active = false

      if (item.type === 'technology') {
        this.selected.technologies = this.selected.technologies.filter(
          ({ slug }) => slug !== item.slug
        )
      } else {
        this.selected.categories = this.selected.categories.filter(
          ({ slug }) => slug !== item.slug
        )
      }
    },
    toggleLanguage(item) {
      if (typeof item.value !== 'object') {
        this.toggleVariant(item)

        this.$nextTick(() => {
          this.selectedLanguage = ''

          this.$refs.language.blur()
        })
      } else {
        this.selectedLanguage = item

        this.$nextTick(() => {
          this.$watch('$refs.variant.isMenuActive', (active) => {
            if (!active) {
              this.selectedLanguage = ''

              this.$refs.language.blur()
            }
          })

          this.$refs.language.blur()
        })
      }
    },
    toggleVariants() {
      const active = this.variants.every(({ active }) => active)

      this.variants.forEach((item) => this.toggleVariant(item, active))
    },
    toggleVariant(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.languages = this.selected.languages.filter(
          (language) => language.value !== item.value
        )
      } else {
        item.active = true

        this.selected.languages.push(item)
      }
    },
    toggleTlds() {
      const active = this.tlds.every(({ active }) => active)

      this.tlds.forEach((item) => this.toggleTld(item, active))
    },
    toggleTld(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.tlds = this.selected.tlds.filter(
          (tld) => tld.value !== item.value
        )
      } else {
        item.active = true

        this.selected.tlds.push(item)
      }

      this.selected.tlds = this.selected.tlds.filter(
        ({ value }, index) =>
          this.selected.tlds.findIndex((tld) => tld.value === value) === index
      )
    },
    toggleGeoIp(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.geoIps = this.selected.geoIps.filter(
          ({ value }) => value !== item.value
        )
      } else {
        item.active = true

        this.selected.geoIps.push(item)
      }

      this.selected.geoIps = this.selected.geoIps.filter(
        ({ value }, index) =>
          this.selected.geoIps.findIndex(
            ({ value: _value }) => _value === value
          ) === index
      )
    },
    addTld() {
      const value = this.tld.toLowerCase()

      if (!/^.[a-z0-9.]*[a-z0-9]+$/.test(value)) {
        this.tldErrors = ['E.g. .com.au']

        return
      }

      const tld = {
        text: value,
        active: true,
        parent: '',
        value,
      }

      Object.keys(tlds).forEach((country) => {
        if (tlds[country].includes(tld.value)) {
          tld.parent = country
        }
      })

      this.selected.tlds.push(tld)

      this.selected.tlds = this.selected.tlds.filter(
        ({ value }, index) =>
          this.selected.tlds.findIndex((tld) => tld.value === value) === index
      )

      this.tld = ''
      this.tldErrors = []
    },
    async fileChange(file) {
      this.file = ''
      this.fileErrors = []

      if (!file) {
        return
      }

      this.file = (await file.text())
        .trim()
        .split('\n')
        .map((line, i) => {
          const a = document.createElement('a')

          a.href = (line.startsWith('http') ? line : `http://${line}`).trim()

          const { hostname } = a

          if (!hostname) {
            this.fileErrors.push(`Invalid URL on line ${i + 1}: ${line}`)
          }

          return a.href
        })

      this.fileErrors = this.fileErrors.slice(0, 10)

      if (this.file.length > 100000) {
        this.fileErrors.push('Limit of 100,000 URLs exceeded')
      }

      this.file = this.file.join('\n')
    },
  },
}
</script>

<style>
.nowrap {
  white-space: nowrap;
}
</style>
