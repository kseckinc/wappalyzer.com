<template>
  <v-btn class="spinner ml-n1" icon disabled small>
    <v-icon>{{ mdiAutorenew }}</v-icon>
  </v-btn>
</template>

<script>
import { mdiAutorenew } from '@mdi/js'

export default {
  data() {
    return { mdiAutorenew }
  },
}
</script>

<style>
.spinner {
  animation: spinner 1.5s infinite;
}

@keyframes spinner {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
