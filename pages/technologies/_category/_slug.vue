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

      <Progress v-if="!technology" />

      <template v-if="technology">
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

          <v-divider vertical class="ml-3" />

          <v-btn :href="technology.website" color="accent" target="_blank" text>
            Visit website
            <v-icon right small>mdi-open-in-new</v-icon>
          </v-btn>
        </div>

        <template v-if="technology.hostnames < 50">
          <v-alert color="info" class="mt-8" outlined>
            <h3 class="mb-4">No data available, yet</h3>

            <template
              v-if="
                technology.createdAt > Date.now() / 1000 - 60 * 60 * 24 * 30
              "
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
            <v-icon left>mdi-magnify</v-icon>
            Browse technologies
          </v-btn>
        </template>
        <template v-else>
          <v-row>
            <v-col md="10" lg="8">
              <p>
                Wappalyzer tracks over
                {{ formatNumber(technology.hostnames, true) }} websites that use
                {{ technology.name }}.
              </p>
            </v-col>
          </v-row>

          <v-btn
            :to="`/lists/${categorySlug}/${slug}/`"
            color="accent"
            class="mb-4"
            outlined
          >
            <v-icon left>mdi-filter-variant</v-icon> Create a lead list
          </v-btn>

          <v-card class="my-4">
            <v-card-title>Websites using {{ technology.name }}</v-card-title>
            <v-card-text class="px-0">
              <v-simple-table>
                <thead>
                  <tr>
                    <th width="30%">Hostname</th>
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
                      <v-icon color="grey" small>mdi-open-in-new</v-icon>
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
              {{ technology.name }}.
            </small>
          </p>

          <v-row>
            <v-col md="8">
              <p>
                These are the top {{ technology.name }} websites. Download the
                full list of
                <nuxt-link :to="`/lists/${categorySlug}/${slug}/`"
                  >websites and companies using {{ technology.name }}</nuxt-link
                >, including email addresses, phone numbers, LinkedIn profiles
                and more.
              </p>
            </v-col>
          </v-row>
        </template>
      </template>
    </Page>

    <Logos />
  </div>
</template>

<script>
import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Progress from '~/components/Progress.vue'
import Bar from '~/components/Bar.vue'
import Logos from '~/components/Logos.vue'

export default {
  components: {
    Page,
    TechnologyIcon,
    Progress,
    Bar,
    Logos,
  },
  data() {
    return {
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
  },
  async mounted() {
    try {
      this.technology = (
        await this.$axios.get(`technologies/${this.slug}`)
      ).data
    } catch (error) {
      this.$nuxt.error(error)
    }
  },
}
</script>
