<template>
  <Page :title="title" :head="meta" no-heading>
    <v-card
      id="form"
      color="secondary"
      style="overflow: hidden;"
      class="mt-12 mb-4"
    >
      <v-card-title>
        <v-row align="center">
          <v-col cols="12" sm="4" class="py-0">
            <v-icon color="primary" left>{{ mdiLayersOutline }}</v-icon>
            Lookup
          </v-col>
          <v-col cols="12" sm="8" class="py-0">
            <Credits />
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="pb-0">
        <Url ref="url" :url="url" class="mb-4" @change="submit" />

        <v-alert v-if="error" color="info" class="mb-4" outlined>
          {{ error }}
        </v-alert>

        <v-card v-if="loading" class="mb-4">
          <v-card-text class="d-flex justify-center">
            <Progress />
          </v-card-text>
        </v-card>

        <v-expansion-panels
          v-if="technologies"
          ref="panels"
          v-model="panels"
          class="mb-4"
          multiple
        >
          <Attributes :hostname="attributes" />

          <v-expansion-panel>
            <v-expansion-panel-header
              class="subtitle-2"
              style="line-height: 1em;"
            >
              Technologies
              <span class="ml-1 text--disabled"
                >({{ technologies.length }})</span
              >
            </v-expansion-panel-header>
            <v-expansion-panel-content class="nopadding">
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
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mdiLayersOutline, mdiMagnify, mdiCheck, mdiClose } from '@mdi/js'

import Page from '~/components/Page.vue'
import Progress from '~/components/Progress.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Credits from '~/components/Credits.vue'
import Url from '~/components/Url.vue'
import Attributes from '~/components/Attributes.vue'
import { lookup as meta } from '~/assets/json/meta.json'
import sets from '~/assets/json/sets.json'
import countries from '~/assets/json/countries.json'
import languages from '~/assets/json/languages.json'
import states from '~/assets/json/states.json'

export default {
  components: {
    Page,
    Progress,
    TechnologyIcon,
    Credits,
    Url,
    Attributes,
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
      mdiCheck,
      mdiClose,
      url: '',
      lastUrl: '',
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
      technologies: false,
      panels: [],
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
    }),
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        await this.getCredits()
      }
    },
  },
  async mounted() {
    ;({ url: this.url } = this.$route.query)

    this.$refs.url.focus()

    if (this.url) {
      this.$router.replace({ path: this.$route.path })

      this.$nextTick(() => this.$refs.url.search())
    }

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
    async submit(url) {
      if (url === this.lastUrl && this.technologies) {
        return
      }

      this.lastUrl = url

      this.error = false
      this.technologies = false

      if (!this.$store.state.user.isSignedIn) {
        return
      }

      // Check credits

      this.loading = true

      let credits

      try {
        ;({
          credits,
          technologies: this.technologies,
          attributes: this.attributes,
        } = (await this.$axios(`lookup-site/${encodeURIComponent(url)}`)).data)

        this.panels = []

        this.$nextTick(() => {
          this.panels.push(this.$refs.panels.items.length - 1)

          this.scrollTo('#form')
        })

        this.$store.commit('credits/set', credits)
      } catch (error) {
        this.error =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.response.data ||
          this.getErrorMessage(error)
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

<style>
.nopadding .v-expansion-panel-content__wrap {
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
}
</style>
