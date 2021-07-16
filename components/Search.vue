<template>
  <v-select
    ref="results"
    v-model="selection"
    :items="results"
    background-color="white"
    placeholder="Website URL, technology, keyword or email address"
    :append-icon="mdiMagnify"
    :loading="loading ? 'white' : false"
    hide-details="auto"
    return-object
    solo
    @focus="focus"
    @change="submit"
  >
    <template #prepend-item>
      <v-form ref="form" class="search" @submit.prevent="search">
        <v-text-field
          ref="search"
          v-model="query"
          class="pt-2 mx-4"
          placeholder="Website URL, technology, keyword or email address"
          :append-icon="mdiMagnify"
          :loading="!!(loading && query)"
          outlined
          required
          hide-details="auto"
          @click:append="search"
        />
      </v-form>

      <v-alert v-if="error" color="error" class="ma-4" text>
        {{ error }}
      </v-alert>

      <v-divider class="mt-4 mb-2" />

      <div v-if="!results.length" class="pt-1 pb-2 px-4 text--disabled">
        <small>{{
          query && !loading ? 'No results found.' : 'Type something...'
        }}</small>
      </div>
    </template>

    <template #selection="{ item }">
      {{ item.text }}
    </template>

    <template #item="{ item }" class="justify-space-between">
      <template v-if="item.type === 'category'">
        {{ item.text }}

        <v-spacer />

        <div class="d-flex align-center caption font-weight-medium">
          Category
          <v-icon color="primary" size="20" right>{{ mdiShape }}</v-icon>
        </div>
      </template>

      <template v-if="item.type === 'technology'">
        <div class="d-flex align-center">
          <TechnologyIcon :icon="item.icon" />

          <span>{{ item.text }}</span>
        </div>

        <v-spacer />

        <div class="d-flex align-center caption font-weight-medium">
          Technology
          <v-icon color="primary" size="20" right>{{ mdiApps }}</v-icon>
        </div>
      </template>

      <template v-else-if="item.type === 'lookup'">
        {{ item.text }}

        <v-spacer />

        <div class="d-flex align-center caption font-weight-medium">
          Technology lookup
          <v-icon color="primary" size="20" right>{{
            mdiLayersOutline
          }}</v-icon>
        </div>
      </template>

      <template v-else-if="item.type === 'verify'">
        {{ item.text }}

        <v-spacer />

        <div class="d-flex align-center caption font-weight-medium">
          Email verification
          <v-icon color="primary" size="20" right>{{
            mdiEmailCheckOutline
          }}</v-icon>
        </div>
      </template>

      <template v-else-if="item.type === 'keyword'">
        <v-chip color="primary lighten-1 primary--text" label>
          {{ item.text }}
        </v-chip>

        <v-spacer />

        <div class="d-flex align-center caption font-weight-medium">
          Keyword search
          <v-icon color="primary" size="20" right>{{ mdiMagnify }}</v-icon>
        </div>
      </template>
    </template>

    <template #no-data>
      <div />
    </template>
  </v-select>
</template>

<script>
import {
  mdiMagnify,
  mdiLayersOutline,
  mdiApps,
  mdiShape,
  mdiEmailCheckOutline,
} from '@mdi/js'

import TechnologyIcon from '~/components/TechnologyIcon.vue'

export default {
  components: {
    TechnologyIcon,
  },
  data() {
    return {
      mdiMagnify,
      results: [],
      error: '',
      loading: false,
      query: '',
      technologies: [],
      categories: [],
      searchTimeout: null,
      selection: false,
      mdiLayersOutline,
      mdiApps,
      mdiShape,
      mdiEmailCheckOutline,
    }
  },
  watch: {
    query() {
      clearTimeout(this.searchTimeout)

      this.searchTimeout = setTimeout(() => this.search(), 300)
    },
  },
  methods: {
    search() {
      this.results = []

      const query = this.query.trim()

      if (query.match(/^((https?:\/\/|www\/)|[a-z0-9._]+\.[a-z.]+$)/i)) {
        let hostname

        try {
          ;({ hostname } = new URL(
            query.startsWith('http') ? query : `http://${query}`
          ))
        } catch (error) {
          // Continue
        }

        hostname = hostname.replace(/^www\./, '').toLowerCase()

        if (hostname && hostname.match(/^.+\..+$/)) {
          this.results.push({
            type: 'lookup',
            text: hostname,
            to: `/lookup/${hostname}/`,
          })
        }
      }

      if (query.match(/^.+@.+\..+$/i)) {
        let hostname

        try {
          ;({ hostname } = new URL(`http://${query.split('@').pop()}`))
        } catch (error) {
          // Continue
        }

        if (hostname) {
          this.results.push({
            type: 'verify',
            text: query.toLowerCase(),
            to: `/verify/${query.toLowerCase()}/`,
          })
        }
      }

      const match = query.toLowerCase().replace(/[^a-z0-9]/, '')

      const categories = this.categories.filter(({ name }) =>
        name
          .toLowerCase()
          .replace(/[^a-z0-9]/, '')
          .includes(match)
      )

      if (categories.length <= 5) {
        this.results.push(
          ...categories.map(({ slug, name: text }) => ({
            type: 'category',
            text,
            to: `/technologies/${slug}/`,
          }))
        )
      }

      const technologies = this.technologies.filter(({ name }) =>
        name
          .toLowerCase()
          .replace(/[^a-z0-9]/, '')
          .includes(match)
      )

      if (technologies.length <= 50) {
        this.results.push(
          ...technologies.map(({ slug, name: text, icon, categories }) => ({
            type: 'technology',
            text,
            icon,
            to: `/technologies/${
              categories && categories.length ? `${categories.pop().slug}/` : ''
            }${slug}/`,
          }))
        )
      }

      if (query.toLowerCase().match(/^[a-z0-9]{3,}$/)) {
        this.results.push({
          type: 'keyword',
          text: query.toLowerCase(),
          to: `/websites/${query.toLowerCase()}`,
        })
      }
    },
    submit(item) {
      this.loading = true

      this.$router.push(item.to)
    },
    async focus() {
      this.query = ''
      this.loading = false

      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs.search) {
            this.$refs.search.$el.querySelector('input').focus()
          }
        }, 300)
      })

      if (!this.technologies.length) {
        this.loading = true

        this.technologies = (await this.$axios.get('technologies')).data

        this.loading = false

        this.categories = this.technologies.reduce(
          (_categories, { categories }) => {
            categories.forEach((category) => {
              if (!_categories.find(({ slug }) => slug === category.slug)) {
                _categories.push(category)
              }
            })

            return _categories
          },
          []
        )

        this.search()
      }
    },
  },
}
</script>
