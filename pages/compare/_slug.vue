<template>
  <div>
    <Page
      :title="title"
      :seo-title="`${title} feature and pricing comparison`"
      :crumbs="crumbs"
      :head="{ title, meta }"
      no-hero
    >
      <v-card>
        <v-card-text class="mt-4 px-0">
          <v-simple-table>
            <tbody>
              <tr>
                <th width="20%" />
                <td
                  v-for="technology in technologies"
                  :key="technology.slug"
                  class="pb-2"
                  width="40%"
                >
                  <h3>
                    <nuxt-link
                      :to="`/technologies/${technology.categorySlug}/${technology.slug}/`"
                      class="d-flex align-center my-2"
                    >
                      <TechnologyIcon :icon="technology.icon" large />
                      {{ technology.name }}
                    </nuxt-link>
                  </h3>
                </td>
              </tr>
              <tr>
                <th>Website</th>
                <td v-for="technology in technologies" :key="technology.slug">
                  <v-chip
                    :href="technology.website"
                    color="accent"
                    target="_blank"
                    outlined
                    small
                  >
                    Visit {{ formatHostname(technology.website) }}
                    <v-icon right x-small>
                      {{ mdiOpenInNew }}
                    </v-icon>
                  </v-chip>
                </td>
              </tr>
              <tr>
                <th>Categories</th>
                <td
                  v-for="technology in technologies"
                  :key="technology.slug"
                  class="py-2"
                >
                  <v-chip-group column>
                    <v-chip
                      v-for="{ slug: _slug, name } in technology.categories"
                      :key="_slug"
                      :to="`/technologies/${_slug}/`"
                      color="primary"
                      outlined
                      small
                      exact
                    >
                      {{ name }}
                    </v-chip>

                    <v-chip v-if="technology.saas" small outlined>
                      Software as a service
                    </v-chip>

                    <v-chip v-if="technology.oss" small outlined>
                      Open-source software
                    </v-chip>
                  </v-chip-group>
                </td>
              </tr>
              <tr>
                <th>About</th>
                <td
                  v-for="technology in technologies"
                  :key="technology.slug"
                  class="py-2"
                >
                  {{ technology.description || 'No description available.' }}
                </td>
              </tr>
              <tr>
                <th>Websites tracked</th>
                <td v-for="technology in technologies" :key="technology.slug">
                  <nuxt-link
                    :to="`/technologies/${
                      technology.categories.length
                        ? `${technology.categories[0].slug}/`
                        : ''
                    }${technology.slug}`"
                  >
                    {{ formatNumber(technology.hostnames, true) }}
                  </nuxt-link>
                </td>
              </tr>
              <tr>
                <th>Pricing</th>
                <td v-for="technology in technologies" :key="technology.slug">
                  <v-tooltip top>
                    <template #activator="{ on }">
                      <v-chip
                        v-if="
                          technology.pricing.includes('low') ||
                          technology.pricing.includes('mid') ||
                          technology.pricing.includes('high')
                        "
                        small
                        outlined
                        v-on="on"
                      >
                        <v-icon small>
                          {{ mdiCurrencyUsd }}
                        </v-icon>
                        <v-icon
                          :disabled="technology.pricing.includes('low')"
                          small
                        >
                          {{
                            technology.pricing.includes('low')
                              ? mdiCurrencyUsdOff
                              : mdiCurrencyUsd
                          }}
                        </v-icon>
                        <v-icon
                          :disabled="
                            technology.pricing.includes('low') ||
                            technology.pricing.includes('mid')
                          "
                          small
                        >
                          {{
                            technology.pricing.includes('low') ||
                            technology.pricing.includes('mid')
                              ? mdiCurrencyUsdOff
                              : mdiCurrencyUsd
                          }}
                        </v-icon>
                      </v-chip>
                    </template>

                    {{
                      `Typically costs ${
                        technology.pricing.includes('mid')
                          ? 'less than US $1,000/mo'
                          : technology.pricing.includes('high')
                          ? 'more than US $1,000/mo'
                          : 'less than US $100/mo'
                      } (indicative)`
                    }}
                  </v-tooltip>

                  <v-chip
                    v-if="technology.pricing.includes('recurring')"
                    small
                    outlined
                  >
                    Offers paid plans
                  </v-chip>

                  <v-chip
                    v-if="technology.pricing.includes('freemium')"
                    small
                    outlined
                  >
                    Offers a free plan
                  </v-chip>

                  <v-chip
                    v-if="technology.pricing.includes('poa')"
                    small
                    outlined
                  >
                    Price on asking
                  </v-chip>

                  <v-chip
                    v-if="technology.pricing.includes('payg')"
                    small
                    outlined
                  >
                    Pay as you go
                  </v-chip>

                  <v-chip
                    v-if="technology.pricing.includes('onetime')"
                    small
                    outlined
                  >
                    Accepts one-time payments
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <v-divider class="my-12" />

      <h2 class="mb-6">
        <v-row class="align-center px-3">
          <v-icon color="primary" class="mr-2">
            {{ mdiFinance }}
          </v-icon>
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

      <v-divider class="mt-14 mb-12" />

      <h2 class="mb-6">
        <v-row class="align-center px-3">
          <v-icon color="primary" class="mr-2">
            {{ mdiFinance }}
          </v-icon>
          Market share
        </v-row>
      </h2>

      <v-card class="mb-4">
        <v-card-title class="subtitle-2"> Install base </v-card-title>
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

        <v-card-title class="subtitle-2"> Traffic </v-card-title>
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

      <template #footer>
        <v-divider class="mb-12" />

        <v-container class="py-6">
          <UseCases />
        </v-container>
      </template>
    </Page>
  </div>
</template>

<script>
import {
  mdiFinance,
  mdiArrowRight,
  mdiOpenInNew,
  mdiCurrencyUsdOff,
  mdiCurrencyUsd,
} from '@mdi/js'
import { GChart } from 'vue-google-charts'

import Page from '~/components/Page.vue'
import Bar from '~/components/Bar.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import UseCases from '~/components/UseCases.vue'

export default {
  components: {
    Page,
    Bar,
    TechnologyIcon,
    GChart,
    UseCases,
  },
  async asyncData({ route, $axios }) {
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
      mdiFinance,
      mdiArrowRight,
      mdiOpenInNew,
      mdiCurrencyUsdOff,
      mdiCurrencyUsd,
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
    meta() {
      return `Compare${
        this.technologies
          ? ` ${this.technologies.map(({ name }) => name).join(' and ')} `
          : ''
      } market share, usage trends and demographics in ${new Date().getFullYear()}.`
    },
    crumbs() {
      return [
        { title: 'Technologies', to: '/technologies/' },
        { title: 'Compare', to: '/compare/' },
      ]
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

      technology.trend.forEach(({ yearMonth }) => {
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

        trend.push(item)
      })

      return trend
    },
  },
}
</script>
