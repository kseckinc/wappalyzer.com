<template>
  <div>
    <Page
      :title="title"
      :seo-title="`${title} market share`"
      :loading="!category"
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
      <template v-if="category">
        <v-row>
          <v-col md="10" lg="8">
            <p>
              These are the top technologies in the category '{{
                category.name
              }}'.
              <br />
              <nuxt-link :to="`/lists/${category.slug}`"
                >Create a list of
                {{ formatNumber(totalHostnames, true) }} leads</nuxt-link
              >
              with email addresses and phone numbers.
            </p>
          </v-col>
        </v-row>

        <v-btn
          :to="`/lists/${category.slug}`"
          color="accent"
          class="mb-6"
          outlined
        >
          <v-icon left>mdi-filter-variant</v-icon> Create a lead list
        </v-btn>

        <v-card class="my-4">
          <v-card-title>Technologies</v-card-title>
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
                      ><v-icon>mdi-chevron-down</v-icon></v-btn
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
                      ><v-icon>mdi-chevron-down</v-icon></v-btn
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
      </template>
    </Page>

    <Logos />
  </div>
</template>

<script>
import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Bar from '~/components/Bar.vue'
import Logos from '~/components/Logos.vue'

export default {
  components: {
    Page,
    TechnologyIcon,
    Bar,
    Logos,
  },
  data() {
    return {
      category: false,
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
  async mounted() {
    try {
      this.category = (
        await this.$axios.get(`categories/${this.categorySlug}`)
      ).data
    } catch (error) {
      if (error.response && error.response.status === 301) {
        const { categorySlug, slug } = error.response.data
        this.$router.push(`/technologies/${categorySlug}/${slug}`)
      } else {
        this.$nuxt.error(error)
      }
    }
  },
}
</script>
