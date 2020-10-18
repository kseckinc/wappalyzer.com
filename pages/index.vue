<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <Page
      :title="title"
      :seo-title="seotitle"
      :crumbs="false"
      :hero="true"
      no-head
    >
      <UseCases />

      <v-divider class="my-4 my-sm-6" />

      <div v-for="(name, index) in products" :key="index">
        <v-divider v-if="index" class="my-4 my-sm-6" />

        <Product :name="name" :mirror="index % 2 !== 0" />
      </div>

      <template v-slot:footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import Logos from '~/components/Logos.vue'
import Page from '~/components/Page.vue'
import Product from '~/components/Product.vue'
import UseCases from '~/components/UseCases.vue'
import meta from '~/assets/json/meta.json'

export default {
  components: {
    Logos,
    Page,
    UseCases,
    Product,
  },
  data() {
    return {
      title: meta.hero.title,
      seotitle: 'Technology lookup',
      products: Object.keys(meta).filter((name, index) => meta[name].feature),
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Create lists of websites and contacts that use certain technologies, such as ecommerce platform, CMS or CRM.',
        },
      ],
    }
  },
}
</script>
