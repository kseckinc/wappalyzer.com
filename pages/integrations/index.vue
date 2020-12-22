<template>
  <div>
    <Page :title="title" secure>
      <Integrations />
    </Page>
  </div>
</template>

<script>
import Page from '~/components/Page.vue'
import Integrations from '~/components/Integrations.vue'

export default {
  components: {
    Page,
    Integrations,
  },
  data() {
    return {
      title: 'Apps & integrations',
    }
  },
}
</script>
