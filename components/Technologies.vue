<template>
  <div>
    <v-select
      ref="results"
      v-model="selection"
      :items="results"
      class="mb-4"
      label="Find a technology"
      item-value="slug"
      hide-details="auto"
      return-object
      eager
      @change="(item) => $emit('select', item)"
      @focus="focus"
    >
      <template v-slot:prepend-item>
        <v-form ref="form" class="search" @submit.prevent="search">
          <v-text-field
            ref="search"
            v-model="query"
            :loading="loading"
            :error-messages="errors"
            class="mx-4"
            append-icon="mdi-magnify"
            label="Search"
            placeholder="E.g. 'CMS' or 'Shopify'"
            required
            hide-details="auto"
            @click:append="search"
          />
        </v-form>

        <v-divider class="mt-4 mb-2"></v-divider>
      </template>

      <template v-slot:selection="{ item }">
        {{ item.name }}
      </template>

      <template v-slot:item="{ item }">
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

      <template v-slot:no-data>
        <v-list-item class="body-2">
          Enter a search term.
        </v-list-item>
      </template>
    </v-select>
  </div>
</template>

<script>
import TechnologyIcon from '~/components/TechnologyIcon.vue'

export default {
  components: {
    TechnologyIcon,
  },
  data() {
    return {
      errors: [],
      categories: [],
      loading: false,
      query: '',
      searchTimeout: null,
      selection: false,
      technologies: [],
    }
  },
  computed: {
    results() {
      return [
        ...this.categories.map((category) => ({
          ...category,
          type: 'category',
        })),
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
          this.$refs.search.$el.querySelector('input').focus()
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
