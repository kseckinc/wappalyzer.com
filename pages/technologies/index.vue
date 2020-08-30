<template>
  <Page
    :title="title"
    :head="{
      title: title,
      subtitle: 'Browse technologies and categories',
      text: technologiesCount
        ? `Wappalyzer tracks ${formatNumber(
            technologiesCount
          )} technologies across ${formatNumber(categoriesCount)} categories.`
        : '',
    }"
    :loading="!categories"
  >
    <h2 class="mb-4">Technologies</h2>

    <v-row justify="center">
      <v-col sm="8" md="6">
        <Technologies @select="selectTechnology" />
      </v-col>
    </v-row>

    <template v-if="categories">
      <h2 class="mb-4">Categories</h2>

      <v-row>
        <v-col
          v-for="{ name, slug, technologiesCount: count } in categories"
          :key="slug"
          class="py-1 body-2"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <nuxt-link :to="`/technologies/${slug}/`">{{ name }}</nuxt-link>
          <span class="grey--text">({{ count }})</span>
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
