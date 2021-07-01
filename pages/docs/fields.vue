<!-- eslint-disable vue/no-v-html -->
<template>
  <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
    <h1 class="mb-4">
      {{ title }}
    </h1>

    <p style="max-width: 600px">
      Each data product includes a set of base fields, such as websites and
      technologies. Additional fields can optionally be included.
    </p>

    <v-alert
      class="mt-6 mb-8 elevation-1"
      color="secondary"
      :icon="mdiInformationOutline"
    >
      Fields are subject to availability. Contact details such as email
      addresses and phone numbers are unverified.
    </v-alert>

    <v-expansion-panels>
      <v-expansion-panel
        v-for="set in sets.filter(({ disabled }) => !disabled)"
        :key="set.key"
      >
        <v-expansion-panel-header>
          {{ set.name
          }}<span class="body-2 my-n1"
            ><code v-if="set.key" class="ml-2">{{ set.key }}</code>
            <v-chip v-if="set.pro" color="primary" class="ml-2" x-small outlined
              >PRO</v-chip
            >
          </span>
        </v-expansion-panel-header>

        <v-expansion-panel-content class="no-x-padding" eager>
          <Pro v-if="set.pro" class="mb-4" small />

          <v-simple-table>
            <tbody>
              <tr>
                <th width="25%">Field</th>
                <th>Description</th>
              </tr>
              <tr v-for="attr in set.attributes" :key="attr.key">
                <td>
                  <code>{{ attr.key }}</code>
                </td>
                <td v-html="attr.description" />
              </tr>
            </tbody>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </Page>
</template>

<script>
import { mdiInformationOutline, mdiLink } from '@mdi/js'

import Page from '~/components/Page.vue'
import Pro from '~/components/Pro.vue'
import side from '~/assets/json/nav/docs.json'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page,
    Pro,
  },
  data() {
    return {
      title: 'Fields',
      mdiInformationOutline,
      mdiLink,
      side,
      sets,
      crumbs: [{ title: 'Developer documentation', to: '/docs/' }],
    }
  },
}
</script>
