<template>
  <v-dialog v-model="isOpen" :persistent="!error" max-width="400px">
    <v-card>
      <v-card-title>
        Creating your order&hellip;
      </v-card-title>
      <v-card-text class="pb-0">
        <v-alert v-if="error" type="error" class="mb-0">
          {{ error }}
        </v-alert>

        <Progress v-if="!error" class="mx-auto pb-8" />
      </v-card-text>
      <v-card-actions v-if="error">
        <v-spacer />
        <v-btn v-if="error" color="accent" text @click="close">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Progress from '~/components/Progress.vue'

export default {
  components: {
    Progress,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  watch: {
    id(id) {
      this.$router.push(`/orders/${id}`)
    },
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
