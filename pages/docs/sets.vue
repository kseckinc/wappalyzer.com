<template>
  <Page :title="title" :side="side" no-head>
    <h1 class="mb-4">
      Attribute sets
    </h1>

    <p>
      Each data product includes a set of base attributes, such as websites and
      technologies. Additional attributes can optionally be included.
    </p>

    <v-alert class="mt-8" icon="mdi-information-outline" outlined>
      Attributes are subject to availability and unverified.
    </v-alert>

    <p>
      <template
        v-for="set in sets.filter(
          ({ key }) => key !== 'base-list' && key !== 'base-lookup'
        )"
      >
        <h2 :id="set.key" class="mt-8 mb-2">
          {{ set.name }}
          <template v-if="set.key"
            >(<code>{{ set.key }}</code
            >)</template
          >
          <a :href="`#${set.key}`" class="docs__anchor">
            <v-icon color="accent">mdi-link</v-icon>
          </a>
        </h2>

        <v-card class="my-4" flat outlined>
          <v-simple-table>
            <tbody>
              <tr>
                <th width="25%">Attribute</th>
                <th>Description</th>
              </tr>
              <tr v-for="attr in set.attributes">
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
import Page from '~/components/Page.vue'
import side from '~/assets/json/nav/docs.json'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page
  },
  data() {
    return {
      title: 'Developer documentation',
      side,
      sets
    }
  }
}
</script>
