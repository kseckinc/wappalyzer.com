<template>
  <v-btn class="spinner ml-n1" icon disabled small>
    <v-icon>mdi-autorenew</v-icon>
  </v-btn>
</template>

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
