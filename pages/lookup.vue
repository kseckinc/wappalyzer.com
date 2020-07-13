<template>
  <Page :title="title" :head="meta" hero no-heading>
    <v-row>
      <v-col sm="8" md="12" lg="8" class="py-0">
        <template v-if="isSignedIn">
          <p>Credits remaining: {{ credits }}</p>
        </template>

        <h3 class="mb-4">Lookup</h3>

        <v-form ref="form" @submit.prevent="submit" v-model="valid">
          <v-text-field
            v-model="url"
            @click:append="submit"
            :rules="rules.url"
            class="mb-4"
            append-icon="mdi-magnify"
            label="Enter a URL"
            placeholder="https://www.example.com"
            required
            outlined
            large
            hide-details="auto"
          />
        </v-form>

        <v-alert v-if="error" color="info" outlined>
          {{ error }}
        </v-alert>

        <v-card v-if="loading">
          <v-card-text class="d-flex justify-center">
            <Progress />
          </v-card-text>
        </v-card>

        <v-card v-if="technologies">
          <v-card-title>
            <span class="overline"
              >{{ technologies.length }}
              {{ technologies.length === 1 ? 'technology' : 'technologies' }}
              identfied</span
            >
          </v-card-title>
          <v-card-text class="px-0">
            <v-simple-table>
              <tbody>
                <tr
                  v-for="{ name, slug, categories, icon } in technologies"
                  :key="name"
                >
                  <td width="1">
                    <nuxt-link
                      :to="`/technologies/${categories[0].slug}/${slug}`"
                      class="d-flex align-center body-2 my-2"
                    >
                      <TechnologyIcon :icon="icon" />
                      {{ name }}
                    </nuxt-link>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-continue />
    </v-dialog>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Page from '~/components/Page.vue'
import SignIn from '~/components/SignIn.vue'
import Progress from '~/components/Progress.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import { lookup as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Page,
    SignIn,
    Progress,
    TechnologyIcon
  },
  data() {
    return {
      title: meta.title,
      error: false,
      loading: false,
      meta,
      url: '',
      rules: {
        url: [
          (v) => {
            try {
              new URL(v) // eslint-disable-line no-new

              return true
            } catch (error) {
              return 'Enter a valid URL, e.g. https://www.example.com'
            }
          }
        ]
      },
      signInDialog: false,
      technologies: false,
      valid: true
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits
    })
  },
  watch: {
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn && this.signInDialog) {
        this.signInDialog = false

        this.submit()
      }
    }
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        await this.getCredits()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get'
    }),
    async submit() {
      this.error = false
      this.technologies = false

      if (!this.$store.state.user.isSignedIn) {
        this.signInDialog = true

        return
      }

      this.loading = true

      if (this.$refs.form.validate()) {
        let credits

        try {
          ;({ credits, technologies: this.technologies } = (
            await this.$axios(`lookup/${encodeURIComponent(this.url)}`)
          ).data)

          this.$store.commit('credits/set', credits)
        } catch (error) {
          this.error =
            (error.response && error.response.data) ||
            this.getErrorMessage(error)
        }
      }

      this.loading = false
    }
  }
}
</script>
