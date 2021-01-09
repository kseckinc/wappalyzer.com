<template>
  <div>
    <v-form ref="form" @submit.prevent="search">
      <v-text-field
        v-if="!urls.length"
        ref="search"
        v-model="query"
        :loading="loading"
        :error-messages="error"
        :label="`Website URL or company name${
          isSignedIn ? ' (1 credit per lookup)' : ''
        }`"
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
        :label="`Website URL or company name${
          isSignedIn ? ' (1 credit per lookup)' : ''
        }`"
        background-color="white"
        item-value="slug"
        hide-details="auto"
        eager
        outlined
        @focus="focus"
      >
        <template #prepend-item>
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

        <template #selection="{ item }">
          {{ item.name }}
        </template>

        <template #item="{ item }">
          <div class="d-flex align-center py-2">
            <span>{{ item }}</span>
          </div>
        </template>

        <template #no-data>
          <div />
        </template>
      </v-select>
    </v-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiMagnify } from '@mdi/js'

export default {
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
  mounted() {
    this.query = this.url
  },
  methods: {
    focus() {
      this.$refs.search.$el.querySelector('input').focus()
    },
    async search() {
      this.error = ''
      this.loading = true

      if (this.query.includes('.')) {
        this.loading = false

        this.$emit('change', this.query)

        return
      }

      try {
        const { hostnames } = (
          await this.$axios(
            `company/${this.isSignedIn ? '' : 'public/'}${encodeURIComponent(
              this.query
            )}`
          )
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
