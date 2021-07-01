<template>
  <Page
    :title="title"
    :loading="!technologies || error"
    :head="{
      title,
      subtitle: 'Technologies nominated for removal',
      text: `These technologies have been determined to receive low traffic over an
          extended period of time and are canidates for deletion.`,
    }"
    :crumbs="[{ title: 'Technologies', to: '/technologies/' }]"
  >
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <template v-if="technologies">
      <v-card class="mt-8 mb-4">
        <v-card-title>Technologies</v-card-title>
        <v-card-text v-if="!technologies.length">
          <v-alert class="ma-0" color="info" outlined>
            There are currently no deprecated technologies.
          </v-alert>
        </v-card-text>
        <v-card-text v-else class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th>Technology</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="{ name, slug, icon, createdAt } in technologies"
                :key="slug"
              >
                <td>
                  <nuxt-link
                    :to="`/technologies/${slug}/`"
                    class="body-2 d-flex align-center my-2"
                  >
                    <TechnologyIcon :icon="icon" />
                    {{ name }}
                  </nuxt-link>
                </td>
                <td>
                  {{ formatDate(new Date(createdAt * 1000)) }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </template>
  </Page>
</template>

<script>
import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'

export default {
  components: {
    Page,
    TechnologyIcon,
  },
  data() {
    return {
      title: 'Deprecated',
      error: false,
      technologies: false,
    }
  },
  async created() {
    this.technologies = (await this.$axios.get('technologies/dead')).data
  },
}
</script>
