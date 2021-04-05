<template>
  <Page
    :title="title"
    :head="{
      title: title,
      subtitle: 'Browse technologies and categories',
      text,
    }"
    :loading="!categories"
  >
    <h2 class="mt-6">Search by name</h2>

    <v-row>
      <v-col md="6">
        <Technologies @select="selectTechnology" />
      </v-col>
    </v-row>

    <p class="mt-2">
      <small>
        Or,
        <nuxt-link to="/compare"
          >compare any two technologies side-by-side</nuxt-link
        >.
      </small>
    </p>

    <template v-if="categories">
      <h2 class="mt-8 mb-6">Browse by category</h2>

      <v-row>
        <v-col
          v-for="{ name, slug } in categories"
          :key="slug"
          class="py-1 body-2"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <nuxt-link :to="`/technologies/${slug}/`">{{ name }}</nuxt-link>
        </v-col>
      </v-row>
    </template>
  </Page>
</template>

<script>
import Page from '~/components/Page.vue'
import Technologies from '~/components/Technologies.vue'

export default {
  components: {
    Page,
    Technologies,
  },
  async asyncData({ $axios }) {
    return { categories: (await $axios.get('categories')).data }
  },
  data() {
    return {
      title: 'Technologies',
      categories: false,
    }
  },
  computed: {
    categoriesCount() {
      return this.categories ? this.categories.length : 0
    },
    technologiesCount() {
      return this.categories
        ? this.categories.reduce(
            (count, { technologiesCount }) => count + technologiesCount,
            0
          )
        : 0
    },
    text() {
      return this.technologiesCount
        ? `Wappalyzer tracks ${this.formatNumber(
            this.technologiesCount
          )} web technologies across ${this.formatNumber(
            this.categoriesCount
          )} categories. Search for a technology by name or choose a category for information such as market share and traffic.`
        : ''
    },
  },
  methods: {
    selectTechnology(item) {
      if (item.type === 'technology') {
        this.$router.push(
          `/technologies/${item.categories[0].slug}/${item.slug}/`
        )
      } else {
        this.$router.push(`/technologies/${item.slug}/`)
      }
    },
  },
}
</script>
