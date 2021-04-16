<template>
  <v-card flat tile class="header" color="primary lighten-1">
    <v-container class="body-2">
      <v-breadcrumbs :items="items" class="pa-0">
        <template #divider>
          <span class="caption">/</span>
        </template>
        <template #item="{ item }">
          <nuxt-link v-if="item.to" :to="item.to" class="caption primary--text">
            {{ item.title }}
          </nuxt-link>
          <template v-else>
            <span class="caption">
              {{ item.title }}
            </span>
          </template>
        </template>
      </v-breadcrumbs>
    </v-container>
    <v-divider />
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
