<template>
  <Page :title="title" :crumbs="[{ title: 'Lead lists', to: '/lists/' }]">
    <p class="body-1 mt-2" style="max-width: 600px">
      This is an example of a lead list. Our lead lists include website URLs,
      technology versions, a traffic indicator, company and contact details,
      social media profiles, metadata and more.
    </p>

    <div class="mt-6 mb-8">
      <v-btn class="mr-2" depressed @click="$refs.faqDialog.open()">
        <v-icon left>
          {{ mdiForum }}
        </v-icon>
        FAQs
      </v-btn>

      <v-btn to="/docs/fields/" depressed>
        <v-icon left>
          {{ mdiFormatListBulleted }}
        </v-icon>
        List of fields
      </v-btn>
    </div>

    <v-card class="mb-6">
      <ListSample :sample="sample" :height="600" />
    </v-card>

    <div>
      <v-btn to="/lists/" color="primary" class="mr-2" depressed>
        Create a lead list
        <v-icon right>
          {{ mdiArrowRight }}
        </v-icon>
      </v-btn>
      <v-btn
        href="/lead-list-sample.csv"
        color="primary lighten-1 primary--text"
        depressed
      >
        <v-icon left>
          {{ mdiDownload }}
        </v-icon>
        Download sample
      </v-btn>
    </div>

    <FaqDialog ref="faqDialog" topic="lists" />

    <template #footer>
      <Logos />
    </template>
  </Page>
</template>

<script>
import {
  mdiDownload,
  mdiArrowRight,
  mdiForum,
  mdiFormatListBulleted,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import ListSample from '~/components/ListSample.vue'
import FaqDialog from '~/components/FaqDialog.vue'
import sets from '~/assets/json/sets.json'
import list from '~/static/lead-list-sample.csv'

const lines = list
  .split('\n')
  .map((line) => line.replace(/(^"|"$)/g, '').split('","'))

const keys = lines.shift()

const sample = lines.map((columns) => {
  return columns.reduce((line, column, index) => {
    line[keys[index]] = column

    return line
  }, {})
})

export default {
  components: {
    Page,
    ListSample,
    FaqDialog,
    Logos,
  },
  data() {
    return {
      title: 'Lead list sample',
      sample,
      sets,
      faqDialog: false,
      mdiDownload,
      mdiArrowRight,
      mdiForum,
      mdiFormatListBulleted,
    }
  },
}
</script>
