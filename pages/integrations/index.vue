<template>
  <div>
    <Page :title="title" secure>
      <v-btn href="/apps" class="mb-4" depressed>
        <v-icon left>{{ mdiApps }}</v-icon>
        View all apps
      </v-btn>

      <Apps integrations />
    </Page>
  </div>
</template>

<script>
import { mdiApps } from '@mdi/js'

import Page from '~/components/Page.vue'
import Apps from '~/components/Apps.vue'

export default {
  components: {
    Page,
    Apps,
  },
  data() {
    return {
      title: 'Integrations',
      mdiApps,
    }
  },
}
</script>
