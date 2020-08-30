<template>
  <div>
    <h2 v-if="size === '2'" :id="id">
      <slot />
      <a v-if="id" :href="`#${id}`" class="heading__anchor"
        ><v-icon color="accent">{{ mdiLink }}</v-icon></a
      >
    </h2>
    <h3 v-if="size === '3'" :id="id">
      <slot />
      <a v-if="id" :href="`#${id}`" class="heading__anchor"
        ><v-icon color="accent">{{ mdiLink }}</v-icon></a
      >
    </h3>
  </div>
</template>

<script>
import { mdiLink } from '@mdi/js'

export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '2',
    },
  },
  data() {
    return {
      mdiLink,
    }
  },
}
</script>

<style>
h2 .heading__anchor,
h3 .heading__anchor {
  visibility: hidden;
}

h2:hover .heading__anchor,
h3:hover .heading__anchor {
  visibility: visible;
}

.heading__anchor {
  text-decoration: none;
}
</style>
