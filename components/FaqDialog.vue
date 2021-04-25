<template>
  <v-dialog v-model="isOpen" max-width="600px">
    <v-card>
      <v-card-title>
        <v-icon left>{{ mdiForum }}</v-icon>
        Frequently asked questions</v-card-title
      >
      <v-card-text class="px-0 pb-0">
        <Faqs :topic="topic" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="accent" text @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiForum } from '@mdi/js'

import Faqs from '~/components/Faqs.vue'

export default {
  components: {
    Faqs,
  },
  props: {
    topic: {
      type: String,
      default: 'lists',
    },
  },
  data() {
    return {
      isOpen: false,
      mdiForum,
    }
  },
  methods: {
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false

      this.$emit('close')
    },
  },
}
</script>
