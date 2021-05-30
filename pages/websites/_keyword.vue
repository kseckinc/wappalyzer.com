<template>
  <Page :title="title" :seo-title="seoTitle" :head="meta" narrow no-heading>
    <v-card color="secondary" class="mt-8 mb-4">
      <v-card-title>
        <v-icon color="primary" left>{{ mdiMagnify }}</v-icon>
        Search
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="search">
          <v-text-field
            v-model="input"
            label="Keyword"
            background-color="white"
            :append-icon="mdiMagnify"
            :error-messages="keywordError ? [keywordError] : []"
            required
            outlined
            hide-details="auto"
            @click:append="search"
          />
        </v-form>

        <v-alert v-if="error" color="info" class="mt-4 mb-0" outlined>
          {{ error }}
        </v-alert>

        <v-card v-if="loading" class="mt-4">
          <v-card-text class="d-flex justify-center">
            <Progress />
          </v-card-text>
        </v-card>

        <div v-if="!loading && !websites.length" class="mt-4 mb-n2">
          <v-chip
            v-for="example in [
              'fashion',
              'beauty',
              'health',
              'software',
              'education',
              'finance',
              'insurance',
              'travel',
              'b2b',
              'b2c',
              'wholesale',
              'retail',
              'marketplace',
              'adidas',
            ]"
            :key="example"
            color="primary lighten-1 primary--text"
            class="mr-2 mb-2"
            label
            @click="
              input = example
              search()
            "
            >{{ example }}</v-chip
          >
        </div>
        <template v-else-if="!loading && websites.length">
          <v-card class="my-4">
            <v-card-text class="px-0 pb-0">
              <v-alert
                color="primary lighten-1 primary--text"
                class="mb-0"
                tile
              >
                <p class="subtitle-1 font-weight-medium primary--text mb-2">
                  Reach out to {{ keyword }} companies
                </p>

                <p>
                  Create a list of {{ formatNumber(results, true) }}
                  {{ keyword }} websites with email addresses and phone numbers.
                </p>

                <v-btn
                  :to="`/lists/?keywords=${keyword}`"
                  color="primary"
                  class="mt-2"
                  large
                  depressed
                >
                  <v-icon left>{{ mdiFilterVariant }}</v-icon> Create a lead
                  list
                </v-btn>
              </v-alert>
            </v-card-text>
            <v-card-title class="subtitle-2"
              >{{ formatNumber(results) }} Results</v-card-title
            >
            <v-card-text
              class="px-0"
              placeholder="E.g. JEWELRY"
              :append-icon="mdiMagnify"
              required
              outlined
              hide-details="auto"
              @click:append="search"
            >
              <v-simple-table>
                <tbody>
                  <tr
                    v-for="({ https, www, hostname }, index) in websites"
                    :key="index"
                  >
                    <td>
                      <nuxt-link :to="`/lookup/${hostname}`">
                        {{ hostname }}</nuxt-link
                      >

                      <a
                        :href="`http${https ? 's' : ''}://${
                          www ? 'www.' : ''
                        }${hostname}`"
                        rel="nofollow noopener"
                        target="_blank"
                        ><v-icon color="accent" small>{{
                          mdiOpenInNew
                        }}</v-icon></a
                      >
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>

          <small>
            {{ formatNumber(results) }} Results available. Get the full list of
            <nuxt-link :to="`/lists/?keywords=${keyword}`">
              {{ keyword }} companies and websites.
            </nuxt-link>
          </small>
        </template>
      </v-card-text>
    </v-card>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-sign-up mode-continue />
    </v-dialog>
  </Page>
</template>

<script>
import { mapState } from 'vuex'
import { mdiMagnify, mdiOpenInNew, mdiFilterVariant } from '@mdi/js'

import Page from '~/components/Page.vue'
import Progress from '~/components/Progress.vue'
import SignIn from '~/components/SignIn.vue'

export default {
  components: {
    Page,
    Progress,
    SignIn,
  },
  async asyncData({
    route,
    $axios,
    store: {
      state: {
        user: { isSignedIn },
      },
    },
    redirect,
  }) {
    const { keyword } = route.params

    try {
      let websites = []
      let results = []

      if (keyword) {
        ;({ websites, results } = (
          await $axios.get(`websites${isSignedIn ? '' : '/public'}/${keyword}`)
        ).data)
      }

      return {
        keyword,
        input: keyword,
        lastKeyword: keyword,
        websites,
        results,
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return {
          keyword,
          input: keyword,
          lastKeyword: keyword,
          signInDialog: true,
        }
      }

      return {
        keyword,
        input: keyword,
        lastKeyword: keyword,
        error: error.message || error.toString(),
      }
    }
  },
  data() {
    return {
      title: 'Keyword search',
      error: false,
      keywordError: false,
      loading: false,
      meta: {
        title: 'Keyword search',
        subtitle: 'Find and create lists of websites by keyword',
        text: 'Find websites that use a certain keyword, such as a brand, product, profession or industry. Segment lists by technology, traffic, location and more.',
      },
      input: '',
      keyword: '',
      lastKeyword: '',
      signInDialog: false,
      websites: [],
      results: 0,
      mdiMagnify,
      mdiOpenInNew,
      mdiFilterVariant,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
    }),
    seoTitle() {
      if (this.keyword) {
        return `List of ${this.keyword} websites`
      }

      return 'Keyword search'
    },
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn) {
        this.signInDialog = false

        this.websites = []

        this.search()
      }
    },
    keyword() {
      if (this.keyword) {
        history.pushState({}, null, `/websites/${this.keyword}`)
      }
    },
    input() {
      this.keywordError = false
    },
  },
  mounted() {
    if (this.isSignedIn && this.keyword && !this.websites.length) {
      this.search()
    }
  },
  methods: {
    async search() {
      this.websites = []

      this.keyword = this.input
        .toLowerCase()
        .replace(/[^A-Z0-9 -.]/i, '')
        .replace(/\s\s+/g, ' ')
        .split(' ')
        .filter((word) => word.length >= 3)
        .join(' ')
        .trim()

      if (this.input && !this.keyword.length) {
        this.keywordError = 'Keyword is too short'

        return
      }

      if (
        !this.keyword ||
        (this.keyword === this.lastKeyword && this.websites.length)
      ) {
        return
      }

      this.lastKeyword = this.keyword

      this.error = false

      this.loading = true

      try {
        if (this.isSignedIn) {
          ;({ websites: this.websites, results: this.results } = (
            await this.$axios(`websites/${this.keyword}`)
          ).data)

          if (!this.websites.length) {
            this.error =
              'No results found. Try a variation, e.g. shop, shops or shopping.'
          }
        } else {
          try {
            ;({ websites: this.websites, results: this.results } = (
              await this.$axios(`websites/public/${this.keyword}`)
            ).data)
          } catch (error) {
            if (error.response && error.response.status === 401) {
              this.signInDialog = true
              this.loading = false

              return
            }

            throw error
          }
        }
      } catch (error) {
        this.error =
          (error.response &&
            error.response.data &&
            (error.response.data.message || error.response.data)) ||
          this.getErrorMessage(error)
      }

      this.loading = false
    },
  },
}
</script>
