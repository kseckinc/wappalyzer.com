<template>
  <Page title="Lead lists">
    <Progress class="mb-4" />
  </Page>
</template>

<script>
import Page from '~/components/Page'
import Progress from '~/components/Progress'

export default {
  components: {
    Page,
    Progress,
  },
  mounted() {
    this.$store.commit('lists/setCategorySlug', this.$route.params.category)

    this.$router.replace('/lists/')
  },
}
</script>
