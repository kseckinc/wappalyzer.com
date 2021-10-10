<template>
  <v-sheet
    v-if="!isPlus"
    :class="`${small ? 'py-4' : 'py-6'} text-center`"
    color="primary lighten-1"
    outlined
  >
    <v-btn to="/plus/" color="primary" depressed :small="small">
      Get plus for $5/mo
    </v-btn>
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex'
import { mdiLockOpenVariantOutline } from '@mdi/js'

export default {
  props: {
    small: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { mdiLockOpenVariantOutline }
  },
  computed: {
    ...mapState({
      isPlus: ({ credits }) => credits.plus,
    }),
  },
}
</script>
