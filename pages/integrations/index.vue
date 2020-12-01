<template>
  <div>
    <Page :title="title" secure>
      <v-row>
        <v-col cols="4">
          <v-card>
            <nuxt-link to="/integrations/hubspot/">
              <v-card-text class="py-6" align="center">
                <div class="my-2">
                  <v-icon color="#ff7a59" size="48">
                    {{ mdiHubspot }}
                  </v-icon>
                </div>
                <div class="font-weight-bold">
                  HubSpot
                </div>
              </v-card-text>
            </nuxt-link>
          </v-card>
        </v-col>
      </v-row>
    </Page>
  </div>
</template>

<script>
import { mdiHubspot } from '@mdi/js'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Integrations',
      mdiHubspot,
    }
  },
}
</script>
