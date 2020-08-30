<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <Page
      :title="title"
      :side="side"
      :crumbs="[{ title: 'FAQs', to: '/faq/extension/' }]"
      seo-title="Frequently asked questions"
      no-head
    >
      <h1 class="mb-4">Frequently asked questions</h1>

      <div
        v-for="([question, answer], i) in items"
        :id="slugify(question)"
        :key="question"
      >
        <Heading
          :id="slugify(question)"
          size="3"
          :class="`${i ? 'mt-8' : ''} mb-2`"
        >
          {{ question }}
        </Heading>

        <p v-for="text in answer" :key="text" class="answer" v-html="text"></p>
      </div>
    </Page>
  </div>
</template>

<script>
import Page from '~/components/Page.vue'
import Heading from '~/components/Heading.vue'
import faqs from '~/assets/json/faqs.json'

export default {
  components: {
    Page,
    Heading,
  },
  data() {
    return {
      title: faqs[this.$route.params.id].title,
      side: Object.values(faqs).map(({ title, icon, to }) => ({
        title,
        icon,
        to,
      })),
      items: faqs[this.$route.params.id].items,
    }
  },
  created() {
    if (!faqs[this.$route.params.id]) {
      return this.$nuxt.error({ statusCode: 404, message: 'Page not found' })
    }
  },
  methods: {
    slugify(string) {
      return string
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/--+/, '-')
        .replace(/(^-|-$)/, '')
    },
  },
}
</script>

<style>
h3 .faq__anchor {
  visibility: hidden;
}

h3:hover .faq__anchor {
  visibility: visible;
}

.faq__anchor {
  text-decoration: none;
}
</style>
