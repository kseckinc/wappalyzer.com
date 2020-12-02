<template>
  <div>
    <Page :title="title" secure>
      <v-row>
        <v-col cols="6" md="4">
          <v-card @click="$router.push('/integrations/hubspot/')">
            <v-responsive :aspect-ratio="4 / 3">
              <v-card-text class="pb-0">
                <div class="mb-4">
                  <v-icon color="#ff7a59" x-large>
                    {{ mdiHubspot }}
                  </v-icon>
                </div>

                <h2 class="mb-2">HubSpot</h2>

                <p>
                  See the technology stacks of your leads in your CRM.
                </p>
              </v-card-text>
            </v-responsive>
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
