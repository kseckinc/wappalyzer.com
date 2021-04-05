<template>
  <div>
    <Page :title="title" :head="{ title, text }" :crumbs="crumbs" hero>
      <v-card color="secondary" class="mt-8 mb-4">
        <v-card-title>
          <v-icon color="primary" left>{{ mdiFormatListChecks }}</v-icon>
          Selection
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-card>
                <v-card-title class="subtitle-2"> Technology A </v-card-title>
                <v-card-text>
                  <Technologies
                    no-categories
                    @select="({ slug }) => (technologyA = slug)"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card>
                <v-card-title class="subtitle-2"> Technology B </v-card-title>
                <v-card-text>
                  <Technologies
                    no-categories
                    @select="({ slug }) => (technologyB = slug)"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-btn
        :disabled="!technologyA || !technologyB || technologyA === technologyB"
        :to="`/compare/${technologyA}-vs-${technologyB}/`"
        color="primary"
        class="mt-4 mb-4"
        large
        >Compare <v-icon right>{{ mdiArrowRight }}</v-icon>
      </v-btn>
    </Page>
  </div>
</template>

<script>
import { mdiFormatListChecks, mdiArrowRight } from '@mdi/js'

import Page from '~/components/Page.vue'
import Technologies from '~/components/Technologies.vue'

export default {
  components: {
    Page,
    Technologies,
  },
  data() {
    return {
      title: 'Compare',
      text: `Choose any two technologies to compare them side-by-side.`,
      mdiFormatListChecks,
      mdiArrowRight,
      technologyA: null,
      technologyB: null,
    }
  },
  computed: {
    crumbs() {
      return [{ title: 'Technologies', to: '/technologies/' }]
    },
  },
}
</script>
