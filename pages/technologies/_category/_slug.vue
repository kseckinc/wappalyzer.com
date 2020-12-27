<template>
  <div>
    <Page
      :title="title"
      :seo-title="`Websites using ${title}, reviews and alternatives`"
      :crumbs="crumbs"
      :head="{
        meta: `Download a list of websites${
          technology ? ` using ${technology.name}` : ''
        } with email addresses, phone numbers and LinkedIn profiles.`,
      }"
      no-head
      :hero="false"
    >
      <v-row>
        <v-col cols="12" lg="9" class="py-0">
          <h1 class="d-flex align-center">
            <TechnologyIcon
              :icon="technology ? technology.icon : 'default.svg'"
            />

            {{ title }}
          </h1>

          <div class="d-flex align-center mb-4">
            <v-chip-group>
              <v-chip
                v-for="{ slug: _slug, name } in technology.categories"
                :key="_slug"
                :to="`/technologies/${_slug}/`"
                color="primary"
                outlined
                small
                exact
                >{{ name }}</v-chip
              >
            </v-chip-group>

            <v-btn
              :href="technology.website"
              color="accent"
              target="_blank"
              text
            >
              {{ formatHostname(technology.website) }}
              <v-icon right small>{{ mdiOpenInNew }}</v-icon>
            </v-btn>
          </div>

          <template v-if="technology.hostnames < 50">
            <p v-if="technology.description">
              {{ technology.description }}
            </p>

            <v-alert color="info" outlined>
              <h3 class="mb-4">No data available, yet</h3>

              <template
                v-if="
                  technology.createdAt > Date.now() / 1000 - 60 * 60 * 24 * 30
                "
              >
                We've started tracking {{ technology.name }}. It may take a few
                weeks to collect a meaningful amount of information, which will
                be displayed here.
              </template>
              <template v-else>
                {{ technology.name }} appears to have a small userbase. Only
                technologies with considerable usage are displayed.
              </template>
            </v-alert>

            <v-btn
              to="/technologies/"
              class="mt-4"
              color="accent"
              outlined
              exact
            >
              <v-icon left>{{ mdiMagnify }}</v-icon>
              Browse technologies
            </v-btn>
          </template>
          <template v-else>
            <p v-if="technology.description" class="mb-8">
              {{ technology.description }}
            </p>

            <v-alert color="primary" outlined>
              <p>
                Create a list of
                {{ formatNumber(technology.hostnames, true) }}
                <nuxt-link
                  class="primary--text"
                  :to="`/lists/?technologies=${slug}`"
                >
                  {{ technology.name }} websites</nuxt-link
                >
                with email addresses and phone numbers.
              </p>

              <v-btn
                :to="`/lists/?technologies=${slug}`"
                color="primary"
                depressed
              >
                <v-icon left>{{ mdiFilterVariant }}</v-icon> Create a lead list
              </v-btn>
            </v-alert>

            <v-divider class="mt-12 mb-8" />

            <h2 class="mb-2">
              <v-row class="align-center px-3">
                <v-icon color="primary" class="mr-2">{{ mdiEarth }}</v-icon>
                Websites using {{ technology.name }}
              </v-row>
            </h2>

            <p class="mb-6">
              These are the top websites usings {{ technology.name }} based on
              traffic.
            </p>

            <v-card class="mb-4">
              <v-card-text class="px-0">
                <v-simple-table>
                  <tbody>
                    <tr
                      v-for="(attributes, hostname) in technology.topHostnames"
                      :key="hostname"
                    >
                      <td width="50%">
                        <nuxt-link :to="`/lookup/${hostname}`">
                          {{ hostname }}</nuxt-link
                        >

                        <a
                          :href="`http${attributes.https ? 's' : ''}://${
                            attributes.www ? 'www.' : ''
                          }${hostname}`"
                          rel="nofollow noopener"
                          target="_blank"
                          ><v-icon color="accent" small>{{
                            mdiOpenInNew
                          }}</v-icon></a
                        >
                      </td>
                      <td>
                        <Bar
                          :value="attributes.hits"
                          :max="maxHits"
                          :total="technology.hits"
                          class="mt-2 mt-md-0 mr-4"
                        />
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-card>

            <p class="mb-8">
              <small>
                Get the full list of
                <nuxt-link :to="`/lists/?technologies=${slug}`"
                  >websites and companies using {{ technology.name }}</nuxt-link
                >.
              </small>
            </p>

            <h3 class="mb-2">{{ technology.name }} reports</h3>

            <p>
              Create relevant reports for {{ technology.name }} to find leads or
              learn more about your target audience.
            </p>

            <v-card class="mb-4">
              <v-card-title class="subtitle-2">
                Example reports
              </v-card-title>
              <v-card-text class="px-0">
                <v-simple-table>
                  <tbody>
                    <tr v-for="(list, index) in lists" :key="index">
                      <td>
                        <a
                          class="d-flex align-center"
                          @click="createList(list)"
                        >
                          <v-icon left>{{ mdiFileTableOutline }}</v-icon
                          ><span>{{ list.text }}</span>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-card>

            <p>
              <small>
                Or,
                <nuxt-link :to="`/lists/?technologies=${slug}`">
                  Create a custom {{ technology.name }} report</nuxt-link
                >.
              </small>
            </p>

            <v-divider class="my-8" />

            <h2 class="mb-2">
              <v-row class="align-center px-3">
                <v-icon color="primary" class="mr-2">{{ mdiFinance }}</v-icon>
                {{ technology.name }} usage trend
              </v-row>
            </h2>

            <p class="mb-6">
              This graph shows the growth of {{ technology.name }} since
              {{ formatDate(trendStartDate, 'monthYear') }}.
            </p>

            <v-card>
              <v-card-text>
                <GChart
                  type="LineChart"
                  :data="trend"
                  :options="lineChartOptions"
                  width="100%"
                />
              </v-card-text>
            </v-card>

            <v-divider class="mt-12 mb-8" />

            <h2 class="mb-2">
              <v-row class="align-center px-3">
                <v-icon color="primary" class="mr-2">{{ mdiMap }}</v-icon>
                {{ technology.name }} demographics
              </v-row>
            </h2>

            <p class="mb-6">
              A breakdown of countries and languages used by
              {{ technology.name }} websites.
            </p>

            <v-row class="mb-12">
              <v-col cols="12" md="6" class="py-0">
                <v-card>
                  <v-card-title class="subtitle-2">Countries</v-card-title>
                  <v-card-text class="pb-8">
                    <GChart
                      type="PieChart"
                      :data="topIpCountries"
                      :options="pieChartOptions"
                      width="100%"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-card>
                  <v-card-title class="subtitle-2">Languages</v-card-title>
                  <v-card-text class="pb-8">
                    <GChart
                      type="PieChart"
                      :data="topLanguages"
                      :options="pieChartOptions"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-divider class="my-8" />

            <h2 class="mb-2">
              <v-row class="align-center px-3">
                <v-icon color="primary" class="mr-2">{{
                  mdiLightbulbOnOutline
                }}</v-icon>
                Alternatives to {{ technology.name }}
              </v-row>
            </h2>

            <p class="mb-6">
              These are the most popular {{ technology.name }} alternatives
              based on market share in {{ new Date().getFullYear() }}.
            </p>

            <template v-if="technology.alternatives.length">
              <v-card class="my-4">
                <v-card-text class="px-0">
                  <v-simple-table>
                    <thead>
                      <tr>
                        <th width="30%">Technology</th>
                        <th>Market share</th>
                        <th width="30%" class="text-right">Compare</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="alternative in technology.alternatives"
                        :key="alternative.slug"
                      >
                        <td>
                          <nuxt-link
                            :to="`/technologies/${alternative.categorySlug}/${alternative.slug}/`"
                            class="body-2 d-flex align-center my-2"
                          >
                            <TechnologyIcon :icon="alternative.icon" />
                            {{ alternative.name }}
                          </nuxt-link>
                        </td>
                        <td>
                          <Bar
                            :value="alternative.hostnames"
                            :max="maxHostnames"
                            :total="totalHostnames"
                          />
                        </td>
                        <td class="text-right">
                          <small>
                            <nuxt-link
                              :to="`/compare/${technology.slug}-vs-${alternative.slug}/`"
                            >
                              {{ technology.name }} vs.
                              {{ alternative.name }}
                              <v-icon color="accent" small>{{
                                mdiArrowRight
                              }}</v-icon>
                            </nuxt-link>
                          </small>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </template>

            <p>
              <small>
                See the full list of
                <nuxt-link :to="`/technologies/${categorySlug}/`"
                  >{{ technology.name }} alternatives</nuxt-link
                >.
              </small>
            </p>
          </template>
        </v-col>
        <v-col cols="12" lg="3" class="py-0">
          <v-divider class="mt-4 mb-8 d-lg-none" />

          <h2 class="mb-2">User reviews</h2>

          <div class="mb-4 caption text--disabled">
            <StarRating :stars="technology.rating" large />
            ({{ formatNumber(technology.reviewCount) }})
          </div>

          <div class="mb-6">
            <v-btn outlined @click="openReviewDialog">
              <v-icon left>{{ mdiFountainPenTip }}</v-icon>
              Write a review</v-btn
            >
          </div>

          <template v-if="technology.reviews.length">
            <Review
              v-for="(_review, index) in technology.reviews"
              :key="index"
              :review="_review"
              class="mb-4"
            />
          </template>
          <template v-else>
            <v-card outlined>
              <v-card-text class="caption text--disabled text-center">
                No reviews yet!
              </v-card-text>
            </v-card>
          </template>
        </v-col>
      </v-row>
    </Page>

    <v-dialog v-model="reviewDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Write a review
        </v-card-title>
        <v-card-text class="pb-0">
          <v-alert v-if="reviewError" type="error">
            {{ reviewError }}
          </v-alert>

          <p>
            How likely are you to recommend {{ technology.name }} to a friend or
            colleague?
          </p>

          <div class="mb-4 text--disabled">
            <StarRating
              :stars="review.rating"
              large
              input
              @rate="(rating) => (review.rating = rating)"
              @hover="(rating) => (hoverRating = rating)"
            />

            <template v-if="hoverRating === 1">
              Very unlikely
            </template>
            <template v-if="hoverRating === 2">
              Unlikely
            </template>
            <template v-if="hoverRating === 3">
              Neutral
            </template>
            <template v-if="hoverRating === 4">
              Likely
            </template>
            <template v-if="hoverRating === 5">
              Very likely
            </template>
          </div>

          <p>Describe your experience with {{ technology.name }}.</p>

          <v-textarea
            ref="reviewText"
            v-model="review.text"
            :hint="`${Math.max(0, 250 - review.text.length)} / 250`"
            :rules="reviewRules"
            placeholder="Leave blank to only submit a rating."
            outlined
          />

          <p>
            Choose how your name should appear. You can change your name in
            <nuxt-link to="/account">account settings</nuxt-link>.
          </p>

          <v-radio-group v-model="review.name" hide-details>
            <v-radio
              :disabled="!user.name"
              :label="`${user.name || 'No name provided'}`"
              :value="user.name"
            />
            <v-radio label="Anonymous" value="Anonymous" />
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" text @click="reviewDialog = false">Cancel</v-btn>
          <v-btn
            color="accent"
            text
            :loading="submittingReview"
            :disabled="!review.rating"
            @click="submitReview"
            >Publish</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-continue mode-sign-up />
    </v-dialog>

    <v-dialog
      v-model="createListDialog"
      :persistent="!createlistError"
      max-width="400px"
    >
      <v-card>
        <v-card-title>
          Creating your list&hellip;
        </v-card-title>
        <v-card-text class="pb-0">
          <v-alert v-if="createlistError" type="error" class="mb-0">
            {{ createlistError }}
          </v-alert>

          <Progress v-if="!createlistError" class="mx-auto pb-8" />
        </v-card-text>
        <v-card-actions v-if="createlistError">
          <v-spacer />
          <v-btn v-if="error" color="accent" text @click="close">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <script type="application/ld+json" v-html="JSON.stringify(jsonld)" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiFilterVariant,
  mdiOpenInNew,
  mdiMagnify,
  mdiArrowRight,
  mdiEarth,
  mdiMap,
  mdiLightbulbOnOutline,
  mdiFinance,
  mdiFountainPenTip,
  mdiCheck,
  mdiClose,
  mdiFileTableOutline,
} from '@mdi/js'
import { GChart } from 'vue-google-charts'

import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Bar from '~/components/Bar.vue'
import StarRating from '~/components/StarRating.vue'
import Review from '~/components/Review.vue'
import SignIn from '~/components/SignIn.vue'
import Progress from '~/components/Progress.vue'
import countries from '~/assets/json/countries.json'
import languages from '~/assets/json/languages.json'

export default {
  components: {
    Page,
    TechnologyIcon,
    Bar,
    GChart,
    StarRating,
    Review,
    SignIn,
    Progress,
  },
  async asyncData({ route, $axios, redirect }) {
    const { category, slug } = route.params

    const technology = (await $axios.get(`technologies/${slug}`)).data

    if (
      technology.categories.length &&
      !technology.categories.some(({ slug }) => slug === category)
    ) {
      const categorySlug = technology.categories[0].slug

      redirect(`/technologies/${categorySlug}/${slug}/`)
    }

    return { technology }
  },
  data() {
    return {
      creatingList: false,
      createlistError: false,
      createListDialog: false,
      hoverRating: null,
      lineChartOptions: {
        chartArea: {
          height: '100%',
          width: '100%',
        },
        series: {
          1: {
            lineDashStyle: [2, 2],
            lineWidth: 2,
          },
        },
        lineWidth: 3,
        colors: ['#4608ad', '#a182d5'],
        curveType: 'function',
        enableInteractivity: false,
        hAxis: {
          baselineColor: 'none',
        },
        vAxis: {
          baselineColor: 'none',
          gridlines: { count: 0 },
        },
        legend: {
          position: 'in',
        },
      },
      pieChartOptions: {
        chartArea: {
          height: '100%',
          width: '100%',
        },
        pieHole: 0.7,
        height: 150,
        sliceVisibilityThreshold: 0.01,
        enableInteractivity: false,
        pieSliceText: 'none',
        legend: {
          textStyle: {
            fontSize: 13,
          },
        },
      },
      reviewRules: [
        (v) => v.length < 250 || 'Maximum length exceeded',
        (v) =>
          v.length < 5 ||
          v.replace(/[^A-Z]/g, '').length <
            v.replace(/[^a-z]/g, '').length / 2 ||
          'Too many uppercase characters',
        (v) => !/(fuck|sucks)/.test(v.toLowerCase()) || 'Stay classy',
      ],
      mdiFilterVariant,
      mdiOpenInNew,
      mdiMagnify,
      mdiArrowRight,
      mdiEarth,
      mdiMap,
      mdiFinance,
      mdiLightbulbOnOutline,
      mdiFountainPenTip,
      mdiCheck,
      mdiClose,
      mdiFileTableOutline,
      review: {
        rating: 0,
        text: '',
        name: '',
      },
      reviewDialog: false,
      reviewing: false,
      reviewError: false,
      signInDialog: false,
      submittingReview: false,
      technology: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
    }),
    jsonld() {
      return {
        '@context': 'https://schema.org/',
        '@type': 'WebApplication',
        name: this.technology.name,
        about: {
          description: this.technology.description,
        },
        author: {
          '@type': 'Organization',
          url: this.technology.website,
        },
        applicationCategory: this.technology.categories[0].name,
        review: this.technology.reviews.map(
          ({ name, text, rating, createdAt }) => ({
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name,
            },
            datePublished: new Date(createdAt * 1000).toISOString(),
            reviewBody: text,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: rating.toString(),
            },
          })
        ),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: this.technology.rating || 5,
          ratingCount: this.technology.reviews.length || 1,
        },
      }
    },
    categorySlug() {
      return this.$route.params.category
    },
    slug() {
      return this.$route.params.slug
    },
    title() {
      return this.technology
        ? this.technology.name
        : this.slug
            .replace(/-/g, ' ')
            .replace(/(?:^|\s)\S/g, (s) => s.toUpperCase())
    },
    crumbs() {
      return [
        { title: 'Technologies', to: '/technologies/' },
        {
          title: this.technology
            ? this.technology.categories.find(
                ({ slug }) => (slug = this.categorySlug)
              ).name
            : this.categorySlug,
          to: `/technologies/${this.categorySlug}/`,
        },
      ]
    },
    maxHits() {
      return (
        Object.values(this.technology.topHostnames).reduce(
          (total, { hits }) => (total = Math.max(total, hits)),
          0
        ) || 1
      )
    },
    maxHostnames() {
      return (
        Object.values(this.technology.alternatives).reduce(
          (total, { hostnames }) => (total = Math.max(total, hostnames)),
          0
        ) || 1
      )
    },
    totalHostnames() {
      return (
        Object.values(this.technology.alternatives).reduce(
          (total, { hostnames }) => (total += hostnames),
          0
        ) || 1
      )
    },
    topIpCountries() {
      const totalHostnames = Object.keys(this.technology.topIpCountries).reduce(
        (sum, ipCountry) => sum + this.technology.topIpCountries[ipCountry],
        0
      )

      return [
        ['Country', 'Websites'],
        ...Object.keys(this.technology.topIpCountries).reduce(
          (topIpCountries, ipCountry) => {
            const hostnames = this.technology.topIpCountries[ipCountry]

            const country = countries.find(
              ({ value, text }) =>
                value.toUpperCase() === ipCountry.toUpperCase()
            )

            topIpCountries.push([
              `${country ? country.text : ipCountry} (${Math.round(
                (100 / totalHostnames) * hostnames
              )}%)`,
              hostnames,
            ])

            return topIpCountries
          },
          []
        ),
      ]
    },
    topLanguages() {
      const totalHostnames = Object.keys(this.technology.topLanguages).reduce(
        (sum, language) => sum + this.technology.topLanguages[language],
        0
      )

      return [
        ['Language', 'Websites'],
        ...Object.keys(this.technology.topLanguages).reduce(
          (topLanguages, language) => {
            const hostnames = this.technology.topLanguages[language]

            let _language = language

            for (const name in languages) {
              if (typeof languages[name] === 'string') {
                if (languages[name].toUpperCase() === language.toUpperCase()) {
                  _language = name

                  break
                }
              } else {
                for (const variant in languages[name]) {
                  if (
                    languages[name][variant].toUpperCase() ===
                    language.toUpperCase()
                  ) {
                    _language = name

                    break
                  }
                }
              }
            }

            topLanguages.push([
              `${_language} (${Math.round(
                (100 / totalHostnames) * hostnames
              )}%)`,
              hostnames,
            ])

            return topLanguages
          },
          []
        ),
      ]
    },
    trendStartDate() {
      const yearMonth = [
        ...this.technology.trend,
      ].sort(({ yearMonth: a }, { yearMonth: b }) => (a > b ? 1 : -1))[0]
        .yearMonth

      const month = yearMonth.toString().slice(2, 4)
      const year = `20${yearMonth.toString().slice(0, 2)}`

      const date = new Date()

      date.setTime(0)
      date.setFullYear(year)
      date.setMonth(month)

      return date
    },
    trend() {
      return [
        ['Month', 'Websites', 'Traffic'],
        ...this.technology.trend.map(({ yearMonth, hostnames, hits }) => {
          const month = yearMonth.toString().slice(2, 4)
          const year = `20${yearMonth.toString().slice(0, 2)}`

          const date = new Date()

          date.setTime(0)
          date.setFullYear(year)
          date.setMonth(month)

          return [date, hostnames, hits]
        }),
      ]
    },
    lists() {
      const technologies = [
        {
          slug: this.slug,
          name: this.technology.name,
          icon: this.technology.icon,
          categories: this.technology.categories,
        },
      ]

      return this.technology
        ? [
            {
              text: `${this.technology.name} websites in the United States`,
              query: {
                technologies,
                geoIps: [{ text: 'United States', value: 'US' }],
              },
            },
            {
              text: `${this.technology.name} websites in the United Kindom`,
              query: {
                technologies,
                geoIps: [{ text: 'United Kingdom', value: 'GB' }],
                tlds: ['.uk'],
              },
            },
            {
              text: `Email addresses and phone numbers of ${this.technology.name} customers`,
              query: {
                technologies,
                requiredSets: ['email', 'phone'],
              },
            },
            {
              text: `${this.technology.name} websites with a .com domain`,
              query: {
                technologies,
                tlds: ['.com'],
              },
            },
            {
              text: `Top 5,000 most visited ${this.technology.name} websites`,
              query: {
                technologies,
                subset: 5000,
              },
            },
            {
              text: `5,000 low-traffic ${this.technology.name} websites`,
              query: {
                technologies,
                subset: 5000,
                subsetSlice: 4,
              },
            },
            ...this.technology.categories.map((category) => ({
              text: `Top 500 websites for every technology in the category ${category.name}`,
              query: {
                categories: [category],
                subset: 500,
              },
            })),
          ]
        : []
    },
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn) {
        this.signInDialog = false

        this.review.name = this.user.name || 'Anonymous'

        if (this.reviewing) {
          this.reviewDialog = true
        }

        if (this.creatingList) {
          this.createList()
        }
      }
    },
  },
  mounted() {
    if (this.isSignedIn) {
      this.review.name = this.user.name || 'Anonymous'
    }
  },
  methods: {
    async createList(list = this.creatingList) {
      this.creatingList = list
      this.createError = false

      if (!this.isSignedIn) {
        this.signInDialog = true

        return
      }

      this.createListDialog = true

      try {
        const { id } = (
          await this.$axios.put('lists', {
            query: {
              minAge: 0,
              maxAge: 3,
              ...list.query,
            },
          })
        ).data

        this.$router.push(`/lists/${id}`)
      } catch (error) {
        this.createListError = this.getErrorMessage(error)
      }

      this.creatingList = false
    },
    openReviewDialog() {
      this.reviewError = ''
      this.reviewing = true

      if (!this.isSignedIn) {
        this.signInDialog = true

        return
      }

      this.reviewDialog = true
    },
    async submitReview() {
      if (!this.$refs.reviewText.validate()) {
        return
      }

      this.reviewError = ''
      this.submittingReview = true

      try {
        this.review.text = this.review.text.trim()

        await this.$axios.put(`reviews/${this.technology.slug}`, {
          ...this.review,
        })

        this.technology = (
          await this.$axios.get(`technologies/${this.technology.slug}`)
        ).data

        this.reviewDialog = false
      } catch (error) {
        this.reviewError = this.getErrorMessage(error)
      }

      this.submittingReview = false
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
