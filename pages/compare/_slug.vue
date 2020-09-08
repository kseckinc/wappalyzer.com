<template>
  <div>
    <Page
      :title="title"
      :seo-title="`Websites using ${title}`"
      :crumbs="crumbs"
      no-head
      hero
    >
      <v-row>
        <v-col
          v-for="technology in technologies"
          :key="technology.slug"
          class="py-0"
        >
          <h1 class="d-flex align-center mb-4">
            <TechnologyIcon
              :icon="technology ? technology.icon : 'default.svg'"
              large
            />

            {{ technology.name }}
          </h1>
        </v-col>
      </v-row>

      <v-row class="mb-8">
        <v-col
          v-for="technology in technologies"
          :key="technology.slug"
          class="py-0"
        >
          <v-row class="align-center px-3 my-2 body-2">
            <v-icon class="mr-2" small>{{ mdiLink }}</v-icon>
            <div>
              <a :href="technology.website" target="_blank">
                {{ formatHostname(technology.website) }}
              </a>
            </div>
          </v-row>

          <v-row class="align-center px-3 my-2 body-2">
            <v-icon class="mr-2" small>{{ mdiShape }}</v-icon>
            <div>
              <span
                v-for="({ slug: _slug, name }, index) in technology.categories"
                :key="_slug"
              >
                <template v-if="index">,</template>
                <nuxt-link :to="`/technologies/${_slug}/`">{{
                  name
                }}</nuxt-link>
              </span>
            </div>
          </v-row>

          <v-row class="align-center px-3 my-2 body-2">
            <v-icon class="mr-2" small>{{ mdiEarth }}</v-icon>
            <div>
              <nuxt-link
                :to="`/technologies/${
                  technology.categories.length
                    ? `${technology.categories[0].slug}/`
                    : ''
                }${technology.slug}`"
              >
                {{ formatNumber(technology.hostnames, true) }} websites
              </nuxt-link>
            </div>
          </v-row>

          <v-row class="align-center px-3 my-2 body-2">
            <v-icon class="mr-2" small>{{ mdiInformation }}</v-icon>
            <div>
              {{ technology.description || 'No description available.' }}
            </div>
          </v-row>
        </v-col>
      </v-row>

      <v-divider class="my-12" />

      <h2 class="mb-2">
        <v-row class="align-center px-3">
          <v-icon color="primary" class="mr-2">{{ mdiFinance }}</v-icon>
          Usage trends
        </v-row>
      </h2>

      <p class="mb-6">
        This graph shows the growth of
        {{ technologies.map(({ name }) => name).join(' versus ') }}
        since
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

      <v-divider class="mt-16 mb-12" />

      <h2 class="mb-4">
        <v-row class="align-center px-3">
          <v-icon color="primary" class="mr-2">{{ mdiFinance }}</v-icon>
          Market share
        </v-row>
      </h2>

      <v-card class="mb-8">
        <v-card-title class="subtitle-2">Install base</v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col md="8" class="py-0">
              Relative market shares of
              {{ technologies.map(({ name }) => name).join(' and ') }} based on
              the number of websites that use it.
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="30%">Technology</th>
                <th>Websites</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="technology in technologies" :key="technology.slug">
                <td>
                  <nuxt-link
                    :to="`/technologies/${
                      technology.categories.length
                        ? `${technology.categories[0].slug}/`
                        : ''
                    }${technology.slug}/`"
                    class="body-2 d-flex align-center my-2"
                  >
                    <TechnologyIcon :icon="technology.icon" />
                    {{ technology.name }}
                  </nuxt-link>
                </td>
                <td>
                  <Bar
                    :value="technology.hostnames"
                    :max="
                      technologies.reduce(
                        (max, { hostnames }) => Math.max(hostnames, max),
                        0
                      )
                    "
                    :total="
                      technologies.reduce(
                        (total, { hostnames }) => total + hostnames,
                        0
                      )
                    "
                  />
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>

        <v-divider />

        <v-card-title class="subtitle-2">Traffic</v-card-title>
        <v-card-text class="pb-0">
          <v-row>
            <v-col md="8" class="py-0">
              Relative market shares of
              {{ technologies.map(({ name }) => name).join(' and ') }} based
              traffic received by the websites that use it.
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="30%">Technology</th>
                <th>Traffic</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="technology in technologies" :key="technology.slug">
                <td>
                  <nuxt-link
                    :to="`/technologies/${
                      technology.categories.length
                        ? `${technology.categories[0].slug}/`
                        : ''
                    }/${technology.slug}/`"
                    class="body-2 d-flex align-center my-2"
                  >
                    <TechnologyIcon :icon="technology.icon" />
                    {{ technology.name }}
                  </nuxt-link>
                </td>
                <td>
                  <Bar
                    :value="technology.hits"
                    :max="
                      technologies.reduce(
                        (max, { hits }) => Math.max(hits, max),
                        0
                      )
                    "
                    :total="
                      technologies.reduce((total, { hits }) => total + hits, 0)
                    "
                  />
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <small>
        <nuxt-link to="/compare">Choose technologies to compare</nuxt-link>
        <v-icon color="accent" small>{{ mdiArrowRight }}</v-icon>
      </small>
    </Page>
  </div>
</template>

<script>
import {
  mdiEarth,
  mdiInformation,
  mdiLink,
  mdiShape,
  mdiFinance,
  mdiArrowRight,
} from '@mdi/js'
import { GChart } from 'vue-google-charts'

import Page from '~/components/Page.vue'
import Bar from '~/components/Bar.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'

export default {
  components: {
    Page,
    Bar,
    TechnologyIcon,
    GChart,
  },
  async asyncData({ route, $axios, redirect, error }) {
    const { slug } = route.params

    const [slugA, slugB] = slug.split('-vs-')

    const technologies = (
      await Promise.all([
        $axios.get(`technologies/${slugA}`),
        $axios.get(`technologies/${slugB}`),
      ])
    ).map(({ data }) => data)

    return { technologies }
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
          3: {
            lineDashStyle: [2, 2],
            lineWidth: 2,
          },
        },
        lineWidth: 3,
        colors: ['#4608ad', '#a182d5', '#2196f3', '#8fcaf9'],
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
      mdiEarth,
      mdiInformation,
      mdiLink,
      mdiShape,
      mdiFinance,
      mdiArrowRight,
    }
  },
  computed: {
    slug() {
      return this.$route.params.slug
    },
    title() {
      return this.technologies
        ? this.technologies.map(({ name }) => name).join(' vs. ')
        : this.slug
            .replace(/-/g, ' ')
            .replace(/(?:^|\s)\S/g, (s) => s.toUpperCase())
            .replace(/ Vs /g, ' vs. ')
    },
    crumbs() {
      return [{ title: 'Compare technologies', to: '/compare/' }]
    },
    trendStartYearMonth() {
      return [
        ...this.technologies.map((technology) => technology.trend).flat(),
      ].sort(({ yearMonth: a }, { yearMonth: b }) => (a > b ? 1 : -1))[0]
        .yearMonth
    },
    trendStartDate() {
      const yearMonth = this.trendStartYearMonth

      const month = yearMonth.toString().slice(2, 4)
      const year = `20${yearMonth.toString().slice(0, 2)}`

      const date = new Date()

      date.setTime(0)
      date.setFullYear(year)
      date.setMonth(month)

      return date
    },
    trend() {
      const trend = [
        [
          'Month',
          ...this.technologies
            .map(({ name }) => [`Websites (${name})`, `Traffic (${name})`])
            .flat(),
        ],
      ]

      const technology = this.technologies.find(({ trend }) =>
        trend.find(({ yearMonth }) => yearMonth === this.trendStartYearMonth)
      )

      technology.trend.map(({ yearMonth, hostnames, hits }) => {
        const month = yearMonth.toString().slice(2, 4)
        const year = `20${yearMonth.toString().slice(0, 2)}`

        const date = new Date()

        date.setTime(0)
        date.setFullYear(year)
        date.setMonth(month)

        const item = [date]

        this.technologies.forEach((technology) => {
          const trend = technology.trend.find(
            ({ yearMonth: _yearMonth }) => _yearMonth === yearMonth
          )

          item.push(trend.hostnames || null, trend.hits || null)
        })

        console.log(item)

        trend.push(item)
      })

      return trend
    },
  },
}
</script>
