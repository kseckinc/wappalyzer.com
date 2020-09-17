<template>
  <div vocab="https://schema.org/" typeof="Review">
    <Page
      :title="title"
      :seo-title="`Websites using ${title}`"
      :crumbs="crumbs"
      :head="{
        meta: `Download a list of websites${
          technology ? ` using ${technology.name}` : ''
        } with email addresses, phone numbers and LinkedIn profiles.`,
      }"
      no-head
      hero
    >
      <v-row>
        <v-col cols="9">
          <h1
            class="d-flex align-center"
            property="itemReviewed"
            typeof="Product"
          >
<<<<<<< Updated upstream
        </v-chip-group>

        <v-divider vertical class="ml-3" />

        <v-btn :href="technology.website" color="accent" target="_blank" text>
          Visit website
          <v-icon right small>{{ mdiOpenInNew }}</v-icon>
        </v-btn>
      </div>

      <template v-if="technology.hostnames < 50">
        <v-alert color="info" class="mt-8" outlined>
          <h3 class="mb-4">No data available, yet</h3>
=======
            <TechnologyIcon
              :icon="technology ? technology.icon : 'default.svg'"
            />

            <span property="name">
              {{ title }}
            </span>
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
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
            {{ technology.name }} appears to have a small userbase. Only
            technologies with considerable usage are displayed.
          </template>
        </v-alert>

        <v-btn to="/technologies/" class="mt-4" color="accent" outlined exact>
          <v-icon left>{{ mdiMagnify }}</v-icon>
          Browse technologies
        </v-btn>
      </template>
      <template v-else>
        <v-row>
          <v-col md="10" lg="8">
            <p>
              These are top top websites usings {{ technology.name }}.
              <nuxt-link :to="`/lists/${categorySlug}/${slug}/`"
                >Create a list of
                {{ formatNumber(technology.hostnames, true) }}
                leads</nuxt-link
              >
              with email addresses and phone numbers.
            </p>
          </v-col>
        </v-row>

        <v-btn
          :to="`/lists/${categorySlug}/${slug}/`"
          color="accent"
          class="mb-6"
          outlined
        >
          <v-icon left>{{ mdiFilterVariant }}</v-icon> Create a lead list
        </v-btn>

        <v-card class="my-4">
          <v-card-title>Websites using {{ technology.name }}</v-card-title>
          <v-card-text class="px-0">
            <v-simple-table>
              <thead>
                <tr>
                  <th width="30%">Website</th>
                  <th>Traffic *</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="({ hits }, hostname) in technology.topHostnames"
                  :key="hostname"
                >
                  <td>
                    <a
                      :href="`http://${hostname}`"
                      rel="nofollow"
                      target="_blank"
                      >{{ hostname.replace(/www\./, '') }}</a
                    >
                    <v-icon color="grey" small>{{ mdiOpenInNew }}</v-icon>
                  </td>
                  <td>
                    <Bar
                      :value="hits"
                      :max="maxHits"
                      :total="technology.hits"
                    />
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>

        <p class="mb-8">
          <small>
            * Percentage of pageviews across all tracked websites that use
            {{ technology.name }}.<br />
            Get the full list of
            <nuxt-link :to="`/lists/${categorySlug}/${slug}/`"
              >websites and companies using {{ technology.name }}.</nuxt-link
            >
          </small>
        </p>
      </template>
    </Page>

    <Logos />
=======
            <p v-if="technology.description">
              {{ technology.description }}
            </p>

            <p class="mb-8">
              Create a list of
              {{ formatNumber(technology.hostnames, true) }}
              <nuxt-link :to="`/lists/${categorySlug}/${slug}/`">
                {{ technology.name }} websites</nuxt-link
              >
              with email addresses and phone numbers.
            </p>

            <v-btn
              :to="`/lists/${categorySlug}/${slug}/`"
              color="accent"
              outlined
            >
              <v-icon left>{{ mdiFilterVariant }}</v-icon> Create a lead list
            </v-btn>

            <v-divider class="mt-16 mb-12" />

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

            <v-card class="my-4">
              <v-card-text class="px-0">
                <v-simple-table>
                  <thead>
                    <tr>
                      <th width="30%">Website</th>
                      <th>Traffic</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="({ hits }, hostname) in technology.topHostnames"
                      :key="hostname"
                    >
                      <td>
                        <nuxt-link
                          :to="`/lookup?url=${encodeURIComponent(
                            `http://${hostname}`
                          )}`"
                          >{{ hostname.replace(/www\./, '') }}</nuxt-link
                        >
                      </td>
                      <td>
                        <Bar
                          :value="hits"
                          :max="maxHits"
                          :total="technology.hits"
                        />
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-card>

            <p class="mb-10">
              <small>
                Get the full list of
                <nuxt-link :to="`/lists/${categorySlug}/${slug}/`"
                  >websites and companies using {{ technology.name }}</nuxt-link
                >.
              </small>
            </p>

            <v-divider class="my-12" />

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

            <v-divider class="mt-14 mb-12" />

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

            <v-row class="mb-16">
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

            <v-divider class="my-12" />

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
                              :to="`/compare/${technology.slug}-vs-${alternative.slug}`"
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
        <v-col cols="3">
          <div class="mb-4 caption text--disabled">
            <StarRating :stars="technology.rating" large />
            ({{ formatNumber(technology.reviewCount) }})
          </div>

          <div class="mb-6">
            <v-btn outlined @click="openReviewDialog">Write a review</v-btn>
          </div>

          <Review
            v-for="(_review, index) in technology.reviews"
            :key="index"
            :review="_review"
          />
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
            v-model="review.text"
            :hint="`${Math.max(0, 250 - review.text.length)} / 250`"
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

    <!-- eslint-disable-next-line vue/no-v-html -->
    <script type="application/ld+json" v-html="jsonld" />
>>>>>>> Stashed changes
  </div>
</template>

<script>
<<<<<<< Updated upstream
import { mdiFilterVariant, mdiOpenInNew, mdiMagnify } from '@mdi/js'
=======
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
} from '@mdi/js'
import { GChart } from 'vue-google-charts'
>>>>>>> Stashed changes

import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Bar from '~/components/Bar.vue'
<<<<<<< Updated upstream
import Logos from '~/components/Logos.vue'
=======
import StarRating from '~/components/StarRating.vue'
import Review from '~/components/Review.vue'
import SignIn from '~/components/SignIn.vue'
import countries from '~/assets/json/countries.json'
import languages from '~/assets/json/languages.json'
>>>>>>> Stashed changes

export default {
  components: {
    Page,
    TechnologyIcon,
    Bar,
<<<<<<< Updated upstream
    Logos,
=======
    GChart,
    StarRating,
    Review,
    SignIn,
>>>>>>> Stashed changes
  },
  async asyncData({ route, $axios, error }) {
    const { slug } = route.params

    return {
      technology: (await $axios.get(`technologies/${slug}`)).data,
    }
  },
  data() {
    return {
<<<<<<< Updated upstream
      mdiFilterVariant,
      mdiOpenInNew,
      mdiMagnify,
=======
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
      mdiFilterVariant,
      mdiOpenInNew,
      mdiMagnify,
      mdiArrowRight,
      mdiEarth,
      mdiMap,
      mdiFinance,
      mdiLightbulbOnOutline,
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
>>>>>>> Stashed changes
      technology: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
    }),
    jsonld() {
      return {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: this.technology.name,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: this.technology.rating,
          ratingCount: this.technology.reviews.length,
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
  },
  watch: {
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        this.signInDialog = false

        this.review.name = this.user.name || 'Anonymous'

        if (this.reviewing) {
          this.reviewDialog = true
        }
      }
    },
    'review.text'(text) {
      setTimeout(() => {
        if (this.review.text.length > 250) {
          this.review.text = text.slice(0, 250)
        }
      }, 1)
    },
  },
  mounted() {
    if (this.$store.state.user.isSignedIn) {
      this.review.name = this.user.name || 'Anonymous'
    }
  },
  methods: {
    openReviewDialog() {
      this.reviewError = ''
      this.reviewing = true

      if (!this.$store.state.user.isSignedIn) {
        this.signInDialog = true

        return
      }

      this.reviewDialog = true
    },
    async submitReview() {
      this.reviewError = ''
      this.submittingReview = true

      try {
        await this.$axios.put('reviews', {
          ...this.review,
        })

        this.technology = (
          await this.$axios.get(`technologies/${this.technology.slug}`)
        ).data

        this.reviewDialog = false
      } catch (error) {
        this.reviewError = this.getErrorMessage(error)

        this.submittingReview = false
      }
    },
  },
}
</script>
