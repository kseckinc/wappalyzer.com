<template>
  <div>
    <Page :title="title" secure>
      <v-card>
        <v-card-text>
          <nuxt-link to="/integrations/hubspot/">Hubspot</nuxt-link>
        </v-card-text>
      </v-card>
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
      title: 'Integrations',
    }
  },
}
</script>
