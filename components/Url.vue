<template>
  <div>
    <v-form ref="form" @submit.prevent="search">
      <v-text-field
        v-if="!urls.length"
        ref="search"
        v-model="query"
        :loading="loading"
        :error-messages="error"
        label="Website URL or company name (1 credit per lookup)"
        placeholder="Example or example.com"
        background-color="white"
        :append-icon="mdiMagnify"
        required
        outlined
        hide-details="auto"
        @click:append="search"
      />
      <v-select
        v-else
        ref="urls"
        v-model="selectedUrl"
        :items="urls"
        class="mb-4"
        label="Website URL or company name (1 credit per lookup)"
        background-color="white"
        item-value="slug"
        hide-details="auto"
        eager
        outlined
        @focus="focus"
      >
        <template v-slot:prepend-item>
          <v-form @submit.prevent="search">
            <v-text-field
              ref="search"
              v-model="query"
              :loading="loading"
              :error-messages="error"
              class="pt-0 mx-4"
              placeholder="Facebook or facebook.com"
              :append-icon="mdiMagnify"
              required
              hide-details="auto"
              @click:append="search"
            />
          </v-form>

          <v-divider class="mt-4 mb-2"></v-divider>
        </template>

        <template v-slot:selection="{ item }">
          {{ item.name }}
        </template>

        <template v-slot:item="{ item }">
          <div class="d-flex align-center py-2">
            <span>{{ item }}</span>
          </div>
        </template>

        <template v-slot:no-data>
          <div />
        </template>
      </v-select>
    </v-form>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-sign-up mode-continue />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiMagnify } from '@mdi/js'

import SignIn from '~/components/SignIn.vue'

export default {
  components: {
    SignIn,
  },
  props: {
    url: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      mdiMagnify,
      query: '',
      urls: [],
      signInDialog: false,
      selectedUrl: false,
      error: '',
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
    }),
  },
  watch: {
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        this.signInDialog = false

        if (this.query) {
          this.search()
        }
      }
    },
    selectedUrl(url) {
      if (this.selectedUrl) {
        this.query = url
        this.selectedUrl = false

        this.urls = []

        this.$nextTick(() => {
          this.$refs.search.focus()

          this.search()
        })
      }
    },
    url(url) {
      this.query = this.url
    },
  },
  methods: {
    focus() {
      this.$refs.search.$el.querySelector('input').focus()
    },
    async search() {
      this.error = ''

      let url

      try {
        new URL(this.query) // eslint-disable-line no-new

        url = this.query
      } catch (error) {
        if (this.query.includes('.')) {
          if (this.query.startsWith('www.')) {
            this.query = `http://${this.query}`
          } else {
            this.query = `http://${
              this.query.split('.').length > 2 ? '' : 'www.'
            }${this.query}`
          }

          new URL(this.query) // eslint-disable-line no-new

          url = this.query
        }
      } finally {
        // continue
      }

      if (!this.isSignedIn) {
        this.signInDialog = true

        return
      }

      this.loading = true

      if (url) {
        this.loading = false

        this.query = url

        this.$emit('change', url)

        return
      }

      try {
        const { hostnames } = (
          await this.$axios(`company/${encodeURIComponent(this.query)}`)
        ).data

        this.urls = hostnames.map(
          ({ https, www, hostname }) =>
            `http${https ? 's' : ''}://${www ? 'www.' : ''}${hostname}`
        )

        this.$nextTick(() => {
          if (this.$refs.urls) {
            this.$refs.urls.focus()
            this.$refs.urls.activateMenu()
          }
        })
      } catch (error) {
        this.error =
          error.response && error.response.status === 404
            ? 'No company found with that name.'
            : this.getErrorMessage(error)
      }

      this.loading = false
    },
  },
}
</script>
