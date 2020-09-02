<template>
  <Page :title="title" :head="meta" no-heading>
    <Credits class="mt-8 mb-8" />

    <v-card color="secondary" style="overflow: hidden;" class="mb-4">
      <v-card-title>
        <v-icon color="primary" left>{{ mdiLayersOutline }}</v-icon>
        Lookup
      </v-card-title>

      <v-card-text class="pb-0">
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field
            v-model="url"
            :rules="rules.url"
            :append-icon="mdiMagnify"
            style="background-color: white;"
            label="Enter a URL"
            placeholder="https://www.example.com"
            required
            outlined
            large
            hide-details="auto"
            @click:append="submit"
          />
        </v-form>

        <p>
          <small>
            Price per lookup: 1 credit. Get 50 credits per month on a free plan.
          </small>
        </p>

        <v-alert v-if="error" color="info" class="mb-4" outlined>
          {{ error }}
        </v-alert>

        <v-card v-if="loading" class="mb-4">
          <v-card-text class="d-flex justify-center">
            <Progress />
          </v-card-text>
        </v-card>

        <v-row v-if="technologies">
          <v-col class="py-0 col-12 col-sm-6">
            <v-card class="mb-4">
              <v-card-title class="subtitle-2">
                Technologies ({{ technologies.length }})
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
                          :to="`/technologies/${
                            categories.length ? `${categories[0].slug}/` : ''
                          }${slug}/`"
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
          <v-col
            v-if="
              Object.values(sets).some(({ attributes: _attributes }) =>
                _attributes.some(({ key }) => attributes[key])
              )
            "
            class="py-0 col-12 col-sm-6"
          >
            <template v-for="set in sets">
              <v-card
                v-if="set.attributes.some(({ key }) => attributes[key])"
                :key="set.key"
                class="px-0 mb-4"
              >
                <v-card-title class="subtitle-2 pb-2">
                  {{ set.name }}
                </v-card-title>
                <v-card-text class="px-0">
                  <v-simple-table dense>
                    <tbody>
                      <template v-for="{ name, key } in set.attributes">
                        <tr v-if="attributes[key]" :key="key">
                          <th width="25%">
                            <small>{{
                              (name || key).charAt(0).toUpperCase() +
                              (name || key).substring(1)
                            }}</small>
                          </th>
                          <td>
                            <small>
                              <template v-if="Array.isArray(attributes[key])">
                                <div
                                  v-for="(value, i) in attributes[key]"
                                  :key="i"
                                >
                                  <template v-if="set.key === 'social'">
                                    <a
                                      :href="`${socialBaseUrls[key]}${value}`"
                                      target="_blank"
                                      >{{ value }}</a
                                    >
                                  </template>
                                  <template v-else>
                                    {{ value }}
                                  </template>
                                </div>
                              </template>
                              <template v-else-if="key === 'language'">
                                {{ getLanguage(attributes[key]) }}
                              </template>
                              <template v-else-if="key === 'ipCountry'">
                                {{ getCountry(attributes[key]) }}
                              </template>
                              <template
                                v-else-if="
                                  attributes.ipCountry && key === 'ipRegion'
                                "
                              >
                                {{
                                  getRegion(
                                    attributes.ipCountry,
                                    attributes[key]
                                  )
                                }}
                              </template>
                              <template v-else>
                                {{ attributes[key] }}
                              </template>
                            </small>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </template>
          </v-col>
          <v-col v-else class="py-0 text-center">
            <v-card>
              <v-card-text>
                <small class="text--disabled">
                  No meta data available at this time.
                </small>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-sign-up mode-continue />
    </v-dialog>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mdiLayersOutline, mdiMagnify } from '@mdi/js'

import Page from '~/components/Page.vue'
import SignIn from '~/components/SignIn.vue'
import Progress from '~/components/Progress.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Credits from '~/components/Credits.vue'
import { lookup as meta } from '~/assets/json/meta.json'
import sets from '~/assets/json/sets.json'
import countries from '~/assets/json/countries.json'
import languages from '~/assets/json/languages.json'
import states from '~/assets/json/states.json'

export default {
  components: {
    Page,
    SignIn,
    Progress,
    TechnologyIcon,
    Credits,
  },
  data() {
    return {
      title: meta.title,
      error: false,
      loading: false,
      meta,
      sets,
      attributes: {},
      mdiLayersOutline,
      mdiMagnify,
      url: '',
      rules: {
        url: [
          (v) => {
            try {
              if (v) {
                new URL(v) // eslint-disable-line no-new
              }

              return true
            } catch (error) {
              return 'Enter a valid URL, e.g. https://www.example.com'
            }
          },
          (v) =>
            !v || !this.isSignedIn || !!this.credits || 'Insufficient credits',
        ],
      },
      socialBaseUrls: {
        twitter: 'https://www.twitter.com/',
        facebook: 'https://www.facebook.com/',
        instagram: 'https://www.instagram.com/',
        github: 'https://www.github.com/',
        tiktok: 'https://www.tiktok.com/',
        youtube: 'https://www.youtube.com/',
        pinterest: 'https://www.pinterest.com/',
        linkedin: 'https://www.linkedin.com/',
      },
      signInDialog: false,
      technologies: false,
      valid: true,
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
    }),
  },
  watch: {
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn && this.signInDialog) {
        this.signInDialog = false
      }
    },
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
      getCredits: 'credits/get',
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
          ;({
            credits,
            technologies: this.technologies,
            attributes: this.attributes,
          } = (
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
    },
    getCountry(code) {
      const country = countries.find(
        ({ value }) => value.toUpperCase() === code.toUpperCase()
      )

      return country ? country.text : code
    },
    getRegion(countryCode, regionCode) {
      if (states[countryCode.toUpperCase()]) {
        const region = states[countryCode.toUpperCase()].find(
          ({ value }) => value.toUpperCase() === regionCode.toUpperCase()
        )

        return region ? region.text : regionCode
      }

      return regionCode
    },
    getLanguage(code) {
      for (const name in languages) {
        if (typeof languages[name] === 'string') {
          if (languages[name].toUpperCase() === code.toUpperCase()) {
            return name
          }
        } else {
          for (const variant in languages[name]) {
            if (languages[name][variant].toUpperCase() === code.toUpperCase()) {
              return name === variant ? name : `${name} (${variant})`
            }
          }
        }
      }

      return code
    },
  },
}
</script>
