<!-- eslint-disable vue/no-v-html -->
<template>
  <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
    <h1 class="mb-4">
      Attribute sets
    </h1>

    <p>
      Each data product includes a set of base attributes, such as websites and
      technologies. Additional attributes can optionally be included.
    </p>

    <v-alert class="mt-8" :icon="mdiInformationOutline" outlined>
      Attributes are subject to availability and unverified.
    </v-alert>

    <p>
      <template
        v-for="set in sets.filter(
          ({ key }) => key !== 'base-list' && key !== 'base-lookup'
        )"
      >
        <Heading :id="set.key" :key="set.key" size="2" class="mt-8 mb-2">
          {{ set.name }}
          <template v-if="set.key"
            >(<code>{{ set.key }}</code
            >)</template
          >
        </Heading>

        <v-card :key="set.key" class="my-4" flat outlined>
          <v-simple-table>
            <tbody>
              <tr>
                <th width="25%">Attribute</th>
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
        </v-card>
      </template></p
  ></Page>
</template>

<script>
import { mdiInformationOutline, mdiLink } from '@mdi/js'

import Page from '~/components/Page.vue'
import Heading from '~/components/Heading.vue'
import side from '~/assets/json/nav/docs.json'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page,
    Heading,
  },
  data() {
    return {
      title: 'Attribute sets',
      mdiInformationOutline,
      mdiLink,
      side,
      sets,
      crumbs: [{ title: 'Developer documentation', to: '/docs/' }],
    }
  },
}
</script>
