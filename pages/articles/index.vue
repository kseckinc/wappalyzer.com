<template>
  <div>
    <Page crumbs :title="title" narrow>
      <div v-for="(article, index) in articles" :key="index">
        <nuxt-link :to="article.to">{{ article.title }}</nuxt-link>
      </div>
    </Page>
  </div>
</template>

<script>
import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Articles',
      articles: [
        {
          title: 'Find out what CMS or framework a website is using',
          to: '/articles/find-out-what-cms-or-framework-a-website-is-using',
        },
      ],
    }
  },
}
</script>
