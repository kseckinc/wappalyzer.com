<template>
  <v-navigation-drawer
    color="secondary"
    height="auto"
    width="100%"
    floating
    permanent
  >
    <v-list class="px-0" nav dense>
      <template v-for="(item, i) in items">
        <v-list-item
          :key="i"
          :to="item.to"
          class="mx-2"
          color="primary"
          nuxt
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <template v-if="item.items">
          <v-list-item
            v-for="(subitem, j) in item.items"
            :key="`${i}-${j}`"
            :to="subitem.to"
            class="mx-2"
            color="primary"
            nuxt
            exact
          >
            <v-list-item-icon />
            <v-list-item-content>
              <v-list-item-title class="font-weight-regular">
                {{ subitem.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
