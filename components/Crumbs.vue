<template>
  <v-card flat tile class="header" color="primary">
    <v-container class="body-2 white--text">
      <v-breadcrumbs :items="items" class="pa-0">
        <template v-slot:divider>
          <span class="caption white--text">/</span>
        </template>
        <template v-slot:item="{ item }">
          <nuxt-link v-if="item.to" :to="item.to" class="caption white--text">
            {{ item.title }}
          </nuxt-link>
          <template v-else>
            <span class="caption white--text">
              {{ item.title }}
            </span>
          </template>
        </template>
      </v-breadcrumbs>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    crumbs: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    items() {
      return [
        {
          title: 'Home',
          to: '/',
        },
        ...this.crumbs,
      ]
    },
  },
}
</script>
