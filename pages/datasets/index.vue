<template>
  <div>
    <Page :title="title" :head="meta" hero>
      <v-btn color="accent" to="/faq/datasets" class="mt-4 mb-8" outlined>
        <v-icon left>mdi-forum</v-icon>
        Frequently asked questions
      </v-btn>

      <template v-slot:content>
        <h2 class="mb-4">Get an instant quote</h2>

        <v-card class="mb-4">
          <v-card-text v-if="error">
            <v-alert type="error">
              {{ error }}
            </v-alert>
          </v-card-text>
          <v-row>
            <v-col class="py-0" cols="12" sm="6">
              <v-card-title>
                <v-icon color="primary" left>mdi-format-list-checks</v-icon>
                Selection
              </v-card-title>
              <v-card-text>
                <div class="subtitle-2">Technologies</div>

                <p>
                  Choose one or more technologies to include.
                </p>

                <Technologies ref="selector" v-on:select="selectItem" />
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
                              >{{ item.technologiesCount }} technologies</small
                            >
                          </v-col>
                        </v-row>
                      </td>
                      <td width="1">
                        <v-btn @click="removeItem(item)" icon>
                          <v-icon>mdi-close-circle-outline</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-col>
            <v-col class="py-0" cols="12" sm="6">
              <v-card-title>
                <v-icon color="primary" left>mdi-filter-outline</v-icon>
                Filters <span class="grey--text ml-1">(optional)</span>
              </v-card-title>
              <v-card-text>
                <div class="subtitle-2">Languages</div>

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
                >
                  <template v-slot:item="{ item }">
                    <v-list-item @click="toggleLanguage(item)" ripple>
                      <v-list-item-action>
                        <v-icon :color="item.active ? 'primary' : ''">{{
                          typeof item.value === 'object'
                            ? 'mdi-dots-horizontal'
                            : item.active
                            ? 'mdi-checkbox-marked'
                            : 'mdi-checkbox-blank-outline'
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
                  ref="variant"
                  v-if="variants"
                  :items="variants"
                  class="mb-4"
                  label="Select a language country"
                  hide-details
                >
                  <template v-slot:prepend-item>
                    <v-list-item @click="toggleVariants" ripple>
                      <v-list-item-action>
                        <v-icon
                          :color="
                            selected.languages.length > 0 ? 'primary' : ''
                          "
                          >{{
                            variants.every(({ active }) => active)
                              ? 'mdi-checkbox-marked'
                              : variants.some(({ active }) => active)
                              ? 'mdi-minus-box-outline'
                              : 'mdi-checkbox-blank-outline'
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
                    <v-list-item @click="toggleVariant(item)" ripple>
                      <v-list-item-action>
                        <v-icon :color="item.active ? 'primary' : ''">{{
                          item.active
                            ? 'mdi-checkbox-marked'
                            : 'mdi-checkbox-blank-outline'
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
                        v-on="on"
                        @click:close="toggleVariant(item)"
                        color="primary"
                        outlined
                        close
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

                <div class="subtitle-2 mt-8">Top-level domains</div>

                <p>
                  Target countries by top-level domain.<sup
                    ><a
                      href="https://en.wikipedia.org/wiki/Top-level_domain"
                      target="_blank"
                      ><v-icon color="accent" small>mdi-help-box</v-icon></a
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
                    />
                  </v-col>
                  <v-col class="py-0">
                    <v-form ref="form" @submit.prevent="addTld">
                      <v-text-field
                        v-model="tld"
                        @click:append="addTld"
                        :error-messages="tldErrors"
                        append-icon="mdi-plus"
                        placeholder=".com"
                        hide-details="auto"
                      />
                    </v-form>
                  </v-col>
                </v-row>

                <v-select
                  ref="tld"
                  v-if="selectedCountry"
                  :items="tlds"
                  class="mb-8"
                  label="Select a top-level-domain"
                  hide-details
                >
                  <template v-slot:prepend-item>
                    <v-list-item @click="toggleTlds" ripple>
                      <v-list-item-action>
                        <v-icon
                          :color="selected.tlds.length > 0 ? 'primary' : ''"
                          >{{
                            tlds.every(({ active }) => active)
                              ? 'mdi-checkbox-marked'
                              : tlds.some(({ active }) => active)
                              ? 'mdi-minus-box-outline'
                              : 'mdi-checkbox-blank-outline'
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
                    <v-list-item @click="toggleTld(item)" ripple>
                      <v-list-item-action>
                        <v-icon :color="item.active ? 'primary' : ''">{{
                          item.active
                            ? 'mdi-checkbox-marked'
                            : 'mdi-checkbox-blank-outline'
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
                  <v-tooltip v-for="(item, i) in selected.tlds" :key="i" bottom>
                    <template v-slot:activator="{ on }">
                      <v-chip
                        v-on="item.parent ? on : undefined"
                        @click:close="toggleTld(item)"
                        color="primary"
                        outlined
                        close
                      >
                        {{ item.value }}
                      </v-chip>
                    </template>

                    {{ item.parent }}
                  </v-tooltip>
                </v-chip-group>

                <v-checkbox
                  v-model="matchAll"
                  label="Match all filters (yields fewer results)"
                  hide-details
                ></v-checkbox>
              </v-card-text>

              <v-card-title>
                <v-icon color="primary" left
                  >mdi-arrow-collapse-vertical</v-icon
                >
                Limits <span class="grey--text ml-1">(optional)</span>
              </v-card-title>
              <v-card-text>
                <div class="subtitle-2">Subset</div>

                <p>
                  Limit results to a number of top traficked websites per
                  technology.
                </p>

                <v-form ref="form" @submit.prevent="addTld">
                  <v-text-field
                    v-model="subset"
                    :rules="[
                      (v) =>
                        !v || /^[0-9]+$/.test(v) || 'Value must be numeric',
                      (v) =>
                        !v || v >= 100 || 'Subset size must be at least 100'
                    ]"
                    placeholder="5000"
                    hide-details="auto"
                  />
                </v-form>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <v-btn
          @click="submit"
          :disabled="!selectedItems.length"
          color="primary"
          class="mt-4 mb-4"
          large
          >Request quote <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>

        <p class="mb-8">
          <small>
            By using our services, you agree to our
            <nuxt-link to="/terms" target="_blank">terms of service</nuxt-link>.
          </small>
        </p>
      </template>

      <v-dialog v-model="signInDialog" max-width="400px">
        <SignIn mode-continue mode-sign-up />
      </v-dialog>

      <OrderDialog
        ref="orderDialog"
        v-on:close="orderDialog = false"
        :error="orderError"
        :id="order ? order.id : null"
      />

      <template v-slot:footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import Page from '~/components/Page.vue'
import Technologies from '~/components/Technologies.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Logos from '~/components/Logos.vue'
import SignIn from '~/components/SignIn.vue'
import OrderDialog from '~/components/OrderDialog.vue'
import { datasets as meta } from '~/assets/json/meta.json'
import languages from '~/assets/json/languages.json'
import tlds from '~/assets/json/tlds.json'

export default {
  components: {
    Page,
    Technologies,
    TechnologyIcon,
    Logos,
    SignIn,
    OrderDialog
  },
  data() {
    return {
      title: meta.title,
      countries: Object.keys(tlds),
      error: false,
      matchAll: false,
      meta,
      signInDialog: false,
      selectedCountry: '',
      selectedLanguage: {},
      selected: {
        categories: [],
        technologies: [],
        tlds: [],
        languages: []
      },
      subset: null,
      order: false,
      orderError: '',
      ordering: false,
      tld: '',
      tldErrors: [],
      languages: Object.keys(languages).reduce(
        (list, text) => [...list, { text, value: languages[text] }],
        []
      )
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
              value: this.selectedLanguage.value[text]
            }
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
        value: tld
      }))
    }
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
    }
  },
  async created() {
    const { categorySlug, technologySlug } = this.$store.state.datasets

    if (categorySlug) {
      if (technologySlug) {
        try {
          const { slug, name, icon } = (
            await this.$axios.get(
              `technologies/${categorySlug}/${technologySlug}`
            )
          ).data

          this.selected.technologies.push({
            type: 'technology',
            slug,
            name,
            icon
          })
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      } else {
        try {
          const { slug, name, technologies } = (
            await this.$axios.get(`technologies/${categorySlug}`)
          ).data

          this.selected.categories.push({
            type: 'category',
            slug,
            name,
            technologiesCount: Object.keys(technologies).length
          })
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    }

    this.$store.commit('datasets/setTechnologySlug', false)
    this.$store.commit('datasets/setCategorySlug', false)
  },
  methods: {
    async submit() {
      this.orderError = ''
      this.ordering = true

      if (!this.$store.state.user.isSignedIn) {
        this.signInDialog = true

        return
      }

      this.$refs.orderDialog.open()

      try {
        this.order = (
          await this.$axios.put('orders', {
            product: 'Dataset',
            dataset: {
              query: {
                technologies: this.selected.technologies.map(
                  ({ slug, name, icon, categories }) => ({
                    slug,
                    name,
                    icon,
                    categories
                  })
                ),
                categories: this.selected.categories.map(({ slug, name }) => ({
                  slug,
                  name
                })),
                languages: this.selected.languages.map(
                  ({ text, parent, value }) => ({
                    text:
                      parent && parent !== text ? `${parent} (${text})` : text,
                    value
                  })
                ),
                tlds: this.selected.tlds.map(({ value }) => value),
                matchAll: this.matchAll,
                subset: this.subset
              }
            }
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
        value
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
    }
  }
}
</script>

<style>
.nowrap {
  white-space: nowrap;
}
</style>
