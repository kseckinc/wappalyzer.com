<template>
  <v-sheet color="primary pb-4 pb-sm-0" tile>
    <v-container>
      <v-row class="mt-sm-8 mb-sm-12 text-center white--text" justify="center">
        <v-col cols="12" sm="10" md="8" class="py-0">
          <p class="display-1">{{ title }}</p>

          <p>{{ subtitle }}</p>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
}
</script>
