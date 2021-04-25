<template>
  <div>
    <v-select
      ref="results"
      v-model="selection"
      :items="results"
      :prepend-icon="mdiMagnify"
      class="mb-4"
      label="Find a technology"
      item-value="slug"
      hide-details="auto"
      return-object
      eager
      @change="(item) => $emit('select', item)"
      @focus="focus"
    >
      <template #prepend-item>
        <v-form ref="form" class="search" @submit.prevent="search">
          <v-text-field
            ref="search"
            v-model="query"
            :loading="loading"
            :error-messages="errors"
            class="pt-0 mx-4"
            :placeholder="
              noCategories ? `E.g. Shopify` : `E.g. ecommerce or Shopify`
            "
            :append-icon="mdiMagnify"
            required
            hide-details="auto"
            @click:append="search"
          />
        </v-form>

        <v-divider class="mt-4 mb-2"></v-divider>

        <div v-if="errors.length" class="pt-1 pb-2 px-4 text--disabled">
          <small>
            Can't find what you're looking for?
            <nuxt-link to="/technologies/suggest"
              >Suggest a new technology</nuxt-link
            >.
          </small>
        </div>
      </template>

      <template #selection="{ item }">
        {{ item.name }}
      </template>

      <template #item="{ item }">
        <div v-if="item.type === 'technology'" class="d-flex align-center py-2">
          <TechnologyIcon :icon="item.icon" />
          <span>{{ item.name }}</span>
        </div>
        <template v-else>
          <v-row>
            <v-col>{{ item.name }}</v-col>
            <v-col class="text-right">
              <small>({{ item.technologiesCount }} technologies)</small>
            </v-col>
          </v-row>
        </template>
      </template>

      <template #no-data>
        <div />
      </template>
    </v-select>
  </div>
</template>

<script>
import { mdiMagnify } from '@mdi/js'

import TechnologyIcon from '~/components/TechnologyIcon.vue'

export default {
  components: {
    TechnologyIcon,
  },
  props: {
    noCategories: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      errors: [],
      categories: [],
      loading: false,
      mdiMagnify,
      query: '',
      searchTimeout: null,
      selection: false,
      technologies: [],
    }
  },
  computed: {
    results() {
      return [
        ...(!this.noCategories
          ? this.categories.map((category) => ({
              ...category,
              type: 'category',
            }))
          : []),
        ...this.technologies.map((technology) => ({
          ...technology,
          type: 'technology',
        })),
      ]
    },
  },
  watch: {
    query(query) {
      if (query.length >= 3) {
        clearTimeout(this.searchTimeout)

        this.searchTimeout = setTimeout(() => this.search(), 300)
      }
    },
  },
  methods: {
    async search() {
      this.errors = []
      this.categories = []
      this.technologies = []

      if (this.query.length < 3) {
        this.errors = ['Please enter at least three characters']

        return
      }

      this.loading = true

      try {
        ;({ categories: this.categories, technologies: this.technologies } = (
          await this.$axios.get('search/technologies', {
            params: {
              query: this.query,
            },
          })
        ).data)

        if (!this.categories.length && !this.technologies.length) {
          throw new Error('No matching tecnnologies found.')
        }
      } catch (error) {
        this.errors = [this.getErrorMessage(error)]
      }

      this.loading = false
    },
    clear() {
      this.$nextTick(() => {
        this.$refs.results.blur()

        this.categories = []
        this.errors = []
        this.query = ''
        this.selection = false
        this.technologies = []
      })
    },
    focus() {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs.search) {
            this.$refs.search.$el.querySelector('input').focus()
          }
        }, 300)
      })
    },
  },
}
</script>

<style>
.search__results {
  max-height: 300px;
  overflow-y: auto;
}
</style>
