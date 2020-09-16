<template>
  <div>
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
      <h1 class="d-flex align-center">
        <TechnologyIcon :icon="technology ? technology.icon : 'default.svg'" />

        {{ title }}
      </h1>

      <div class="d-flex align-center mb-2">
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

        <v-btn :href="technology.website" color="accent" target="_blank" text>
          {{ formatHostname(technology.website) }}
          <v-icon right small>{{ mdiOpenInNew }}</v-icon>
        </v-btn>
      </div>

      <template v-if="technology.hostnames < 50">
        <v-row>
          <v-col md="10" lg="8">
            <p v-if="technology.description">
              {{ technology.description }}
            </p>
          </v-col>
        </v-row>

        <v-alert color="info" outlined>
          <h3 class="mb-4">No data available, yet</h3>

          <template
            v-if="technology.createdAt > Date.now() / 1000 - 60 * 60 * 24 * 30"
          >
            We've started tracking {{ technology.name }}. It may take a few
            weeks to collect a meaningful amount of information, which will be
            displayed here.
          </template>
          <template v-else>
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
            <p v-if="technology.description">
              {{ technology.description }}
            </p>

            <p>
              Create a list of {{ formatNumber(technology.hostnames, true) }}
              <nuxt-link :to="`/lists/${categorySlug}/${slug}/`">
                {{ technology.name }} websites</nuxt-link
              >
              with email addresses and phone numbers.
            </p>
          </v-col>
        </v-row>

        <v-btn :to="`/lists/${categorySlug}/${slug}/`" color="accent" outlined>
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
          These are the most popular {{ technology.name }} alternatives based on
          market share in {{ new Date().getFullYear() }}.
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
    </Page>
  </div>
</template>

<script>
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

import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Bar from '~/components/Bar.vue'
import countries from '~/assets/json/countries.json'
import languages from '~/assets/json/languages.json'

export default {
  components: {
    Page,
    TechnologyIcon,
    Bar,
    GChart,
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
      technology: false,
    }
  },
  computed: {
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
  },
}
</script>
