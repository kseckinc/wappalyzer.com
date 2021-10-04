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
    <h2 class="mt-12 mb-4">Popular</h2>

    <v-row class="mb-2">
      <v-col
        v-for="{ name, slug, categorySlug, icon } in technologies"
        :key="slug"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <nuxt-link
          :to="`/technologies/${categorySlug}/${slug}/`"
          class="body-2 text-center text-decoration-none"
        >
          <v-hover v-slot="{ hover }">
            <v-card flat>
              <v-card-text class="d-flex align-center pa-0">
                <TechnologyIcon :icon="icon" large white />

                <div class="ml-2 d-flex align-center text-decoration-none">
                  <span :class="hover ? 'accent--text' : ''">
                    {{ name }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </nuxt-link>
      </v-col>
    </v-row>

    <h2 class="mt-12 mb-4">Search</h2>

    <div style="max-width: 600px">
      <Technologies @select="selectTechnology" />
    </div>

    <p>
      <small>
        Or,
        <nuxt-link to="/compare"
          >compare any two technologies side-by-side</nuxt-link
        >.
      </small>
    </p>

    <template v-if="categories">
      <h2 class="mt-14 mb-6">Browse</h2>

      <v-card class="mb-4">
        <div v-for="group in groups" :key="group.slug" :id="group.slug">
          <v-card-title class="subtitle-1 mb-2">{{ group.name }}</v-card-title>
          <v-card-text class="pb-8">
            <v-row>
              <v-col
                v-for="{ name, slug, technologiesCount } in group.categories"
                :key="slug"
                class="py-1 body-2"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <nuxt-link :to="`/technologies/${slug}/`">{{ name }}</nuxt-link
                ><small class="ml-2 text--disabled">{{
                  technologiesCount
                }}</small>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />
        </div>
      </v-card>
    </template>
  </Page>
</template>

<script>
import Page from '~/components/Page.vue'
import Technologies from '~/components/Technologies.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'

export default {
  components: {
    Page,
    Technologies,
    TechnologyIcon,
  },
  async asyncData({ $axios }) {
    return { categories: (await $axios.get('categories')).data }
  },
  data() {
    return {
      title: 'Technologies',
      categories: false,
      technologies: [
        {
          name: 'Shopify',
          slug: 'shopify',
          categorySlug: 'ecommerce',
          icon: 'Shopify.svg',
        },
        {
          name: 'Magento',
          slug: 'magento',
          categorySlug: 'ecommerce',
          icon: 'Magento.svg',
        },
        {
          name: 'WooCommerce',
          slug: 'woocommerce',
          categorySlug: 'ecommerce',
          icon: 'WooCommerce.svg',
        },
        {
          name: 'PrestaShop',
          slug: 'prestashop',
          categorySlug: 'ecommerce',
          icon: 'Prestashop.svg',
        },
        {
          name: 'Shopware',
          slug: 'shopware',
          categorySlug: 'ecommerce',
          icon: 'Shopware.svg',
        },
        {
          name: 'OpenCart',
          slug: 'opencart',
          categorySlug: 'ecommerce',
          icon: 'OpenCart.png',
        },
        {
          name: 'BigCommerce',
          slug: 'bigcommerce',
          categorySlug: 'ecommerce',
          icon: 'BigCommerce.svg',
        },
        {
          name: 'WordPress',
          slug: 'wordpress',
          categorySlug: 'cms',
          icon: 'WordPress.svg',
        },
        {
          name: 'Drupal',
          slug: 'drupal',
          categorySlug: 'cms',
          icon: 'Drupal.svg',
        },
        {
          name: 'Wix',
          slug: 'wix',
          categorySlug: 'cms',
          icon: 'Wix.svg',
        },
        {
          name: 'Stripe',
          slug: 'stripe',
          categorySlug: 'payment-processors',
          icon: 'Stripe.svg',
        },
        {
          name: 'Klarna',
          slug: 'klarna-checkout',
          categorySlug: 'payment-processors',
          icon: 'Klarna.svg',
        },
      ],
    }
  },
  computed: {
    groups() {
      return this.categories
        ? Object.values(
            this.categories.reduce((grouped, category) => {
              category.groups.forEach(({ slug, name }) => {
                grouped[slug] = grouped[slug] || { slug, name, categories: [] }

                grouped[slug].categories.push(category)
              })

              return grouped
            }, {})
          ).sort(({ name: a }, { name: b }) => (a > b ? 1 : -1))
        : []
    },
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
