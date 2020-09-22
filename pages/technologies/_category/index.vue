<template>
  <div>
    <Page
      :title="title"
      :seo-title="`${title} market share in ${new Date().getFullYear()}`"
      :crumbs="[{ title: 'Technologies', to: '/technologies' }]"
      :head="{
        title,
        subtitle: `${
          category
            ? `Tracking ${
                Object.keys(category.technologies).length
              } technologies in this category`
            : `Technology category`
        }`,
        meta: `Download a list of websites${
          category ? ` using ${category.name} technologies` : ''
        } with email addresses, phone numbers and LinkedIn profiles.`,
      }"
      hero
    >
      <v-row>
        <v-col md="10" lg="8">
          <p>
            Create a list of
            {{ formatNumber(totalHostnames, true) }}
            <nuxt-link :to="`/lists/?category=${category.slug}`"
              >{{ category.name }} websites</nuxt-link
            >
            with email addresses and phone numbers.
          </p>
        </v-col>
      </v-row>

      <v-btn :to="`/lists/?category=${category.slug}`" color="accent" outlined>
        <v-icon left>{{ mdiFilterVariant }}</v-icon> Create a lead list
      </v-btn>

      <v-divider class="mt-14 mb-12" />

      <h2 class="mb-2">
        <v-row class="align-center px-3">
          <v-icon color="primary" class="mr-2">{{ mdiFinance }}</v-icon>
          {{ category.name }} market share
        </v-row>
      </h2>

      <p class="mb-6">
        These are the top {{ category.name }} technologies based on market share
        in 2020.
      </p>

      <v-card class="my-4">
        <v-card-text class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="30%">
                  Technology
                  <v-btn
                    :disabled="sort === 'name'"
                    color="accent"
                    icon
                    x-small
                    @click="sort = 'name'"
                    ><v-icon>{{ mdiChevronDown }}</v-icon></v-btn
                  >
                </th>
                <th>
                  Market share
                  <v-btn
                    :disabled="sort === 'hostnames'"
                    color="accent"
                    icon
                    x-small
                    @click="sort = 'hostnames'"
                    ><v-icon>{{ mdiChevronDown }}</v-icon></v-btn
                  >
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="{ name, slug, icon, hostnames } in technologies"
                :key="slug"
              >
                <td>
                  <nuxt-link
                    :to="`/technologies/${categorySlug}/${slug}/`"
                    class="body-2 d-flex align-center my-2"
                  >
                    <TechnologyIcon :icon="icon" />
                    {{ name }}
                  </nuxt-link>
                </td>
                <td>
                  <Bar
                    :value="hostnames"
                    :max="maxHostnames"
                    :total="totalHostnames"
                  />
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </Page>
  </div>
</template>

<script>
import { mdiFilterVariant, mdiChevronDown, mdiFinance } from '@mdi/js'

import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Bar from '~/components/Bar.vue'

export default {
  components: {
    Page,
    TechnologyIcon,
    Bar,
  },
  async asyncData({ route, redirect, $axios }) {
    const { category: slug } = route.params

    try {
      return {
        category: (await $axios.get(`categories/${slug}`)).data,
      }
    } catch (error) {
      const technology = (await $axios.get(`technologies/${slug}`)).data

      redirect(
        `/technologies/${
          technology.categories.length
            ? `${technology.categories[0].slug}/`
            : ''
        }${slug}/`
      )
    }
  },
  data() {
    return {
      category: false,
      mdiFilterVariant,
      mdiChevronDown,
      mdiFinance,
      sort: 'hostnames',
    }
  },
  computed: {
    categorySlug() {
      return this.$route.params.category
    },
    title() {
      return this.category
        ? this.category.name
        : this.categorySlug
            .replace(/-/g, ' ')
            .replace(/^./, (s) => s.toUpperCase())
    },
    technologies() {
      if (!this.category) {
        return {}
      }

      const { technologies } = this.category
      const ordered = {}

      delete technologies['cart-functionality']

      Object.keys(technologies)
        .sort((a, b) => {
          const order = this.sort === 'name' ? 1 : -1

          return technologies[a][this.sort] > technologies[b][this.sort]
            ? order
            : technologies[a][this.sort] < technologies[b][this.sort]
            ? -order
            : 0
        })
        .forEach((name) => (ordered[name] = technologies[name]))

      return ordered
    },
    maxHostnames() {
      return (
        Object.values(this.technologies).reduce(
          (total, { hostnames }) => (total = Math.max(total, hostnames)),
          0
        ) || 1
      )
    },
    totalHostnames() {
      return (
        Object.values(this.technologies).reduce(
          (total, { hostnames }) => (total += hostnames),
          0
        ) || 1
      )
    },
  },
}
</script>
