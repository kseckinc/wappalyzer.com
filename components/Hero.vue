<template>
  <v-sheet color="primary pb-4 pb-sm-0" tile>
    <v-container>
      <v-row
        :class="`text-center white--text mt-sm-8 ${
          search ? 'mb-1 mb-sm-12' : 'mb-sm-6'
        }`"
        justify="center"
      >
        <v-col cols="12" sm="10" md="8" class="py-0">
          <p class="display-1">
            {{ title }}
          </p>

          <p class="mb-6 mb-sm-12">{{ subtitle }}</p>

          <div v-if="search" style="max-width: 600px; margin: 0 auto">
            <Search />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import Search from '~/components/Search.vue'

export default {
  components: {
    Search,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    search: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
