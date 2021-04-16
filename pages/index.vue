<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <Page
      :title="title"
      :seo-title="seotitle"
      :crumbs="false"
      :hero="true"
      :head="{ title, meta }"
      no-head
    >
      <h1 class="mb-4 text-h2">Empower your sales and marketing teams</h1>

      <UseCases class="mb-10" />

      <div v-for="(name, index) in products" :key="index">
        <v-divider v-if="index" class="my-8 my-sm-10" />

        <Product :name="name" :mirror="index % 2 !== 0" />
      </div>

      <template #footer>
        <Logos apps />
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
      meta:
        'Find out the technology stack of any website. Create lists of websites and contacts by the technologies they use.',
    }
  },
}
</script>
