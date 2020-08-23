<template>
  <div>
    <Hero
      :subtitle="release ? release.version : error ? '' : '...'"
      title="Wappalyzer has been upgraded"
    />

    <v-sheet color="primary" tile>
      <v-container class="white--text text-center body-2 py-6">
        <p>
          Sell and market more effectively with technographic insights.<br />
          Create lists of websites and contacts using certain technologies.
        </p>

        <v-btn to="/" color="white" small outlined>
          Explore our products
        </v-btn>
      </v-container>
    </v-sheet>

    <v-container class="my-sm-12">
      <v-row justify="center">
        <v-col cols="12" sm="8" lg="6" class="py-0">
          <v-card>
            <v-card-title>Changelog</v-card-title>

            <v-card-text v-if="error" class="px-0">
              <v-alert color="error" class="mx-4 mb-0" outlined>
                The changelog could not be loaded at this time.
              </v-alert>
            </v-card-text>
            <div
              v-if="!release && !error"
              class="d-flex justify-center py-2 pb-6"
            >
              <Progress />
            </div>
            <template v-if="release">
              <template v-for="type in ['add', 'fix', 'new']">
                <template v-if="release.items[type].length">
                  <v-card-title
                    v-if="type === 'add'"
                    :key="type"
                    class="subtitle-2"
                  >
                    <v-icon left>mdi-plus-box</v-icon>
                    Additions
                  </v-card-title>
                  <v-card-title
                    v-if="type === 'fix'"
                    :key="type"
                    class="subtitle-2"
                  >
                    <v-icon left>mdi-auto-fix</v-icon>
                    Improvements
                  </v-card-title>
                  <v-card-title
                    v-if="type === 'new'"
                    :key="type"
                    class="subtitle-2"
                  >
                    <v-icon left>mdi-star</v-icon>
                    Features
                  </v-card-title>
                  <v-card-text :key="type" class="px-0">
                    <v-simple-table>
                      <tbody>
                        <tr
                          v-for="(item, index) in release.items[type]"
                          :key="index"
                        >
                          <td>{{ item }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-card-text>
                </template>
              </template>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Hero from '~/components/Hero.vue'
import Progress from '~/components/Progress.vue'

export default {
  components: {
    Hero,
    Progress,
  },
  data() {
    return {
      title: 'Upgraded',
      release: null,
      error: false,
    }
  },
  async created() {
    this.set({})

    try {
      this.release = (await this.$axios.get(process.env.RELEASE_URL)).data
    } catch (error) {
      this.error = this.getErrorMessage(error)
    }
  },
  methods: {
    ...mapActions({
      set: 'page/set',
    }),
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
