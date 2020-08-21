<template>
  <div>
    <Page
      :title="title"
      :seoTitle="`${title} market share`"
      :loading="!category"
      :crumbs="[{ title: 'Technologies', to: '/technologies' }]"
      :head="{
        title,
        subtitle: 'Technology category',
        text: category
          ? `Wappalyzer tracks over
              ${formatNumber(totalHostnames, true)} websites and
              ${Object.keys(technologies).length} technologies in the
              category ${category.name}.`
          : ''
      }"
      hero
    >
      <template v-if="category">
        <v-btn
          :to="`/lists/${category.slug}`"
          color="accent"
          class="mt-4 mb-2"
          outlined
        >
          <v-icon left>mdi-filter-variant</v-icon> Create a lead list
        </v-btn>

        <v-card class="mt-8 mb-4">
          <v-card-title>Technologies</v-card-title>
          <v-card-text class="px-0">
            <v-simple-table>
              <thead>
                <tr>
                  <th width="30%">
                    Technology
                    <v-btn
                      @click="sort = 'name'"
                      :disabled="sort === 'name'"
                      color="accent"
                      icon
                      x-small
                      ><v-icon>mdi-chevron-down</v-icon></v-btn
                    >
                  </th>
                  <th>
                    Market share
                    <v-btn
                      @click="sort = 'hostnames'"
                      :disabled="sort === 'hostnames'"
                      color="accent"
                      icon
                      x-small
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
                      :to="`/technologies/${categorySlug}/${slug}`"
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
    Logos
  },
  data() {
    return {
      category: false,
      sort: 'hostnames'
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
    }
  },
  async created() {
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
  }
}
</script>
