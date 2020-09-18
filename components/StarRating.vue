<template>
  <span>
    <v-icon
      v-for="index in [1, 2, 3, 4, 5]"
      :key="index"
      :color="large ? 'amber' : 'grey'"
      :large="large"
      :small="!large"
      :style="`cursor: ${input ? 'pointer' : 'default'}`"
      @click="rate(index)"
      @mouseover="hover(index)"
      @mouseout="hover(null)"
    >
      <template v-if="rating >= index">
        {{ mdiStar }}
      </template>
      <template v-else-if="rating < index - 0.5">
        {{ mdiStarOutline }}
      </template>
      <template v-else>
        {{ mdiStarHalfFull }}
      </template>
    </v-icon>
  </span>
</template>

<script>
import { mdiStar, mdiStarOutline, mdiStarHalfFull } from '@mdi/js'

export default {
  props: {
    stars: {
      type: Number,
      default: 0,
    },
    large: {
      type: Boolean,
      default: false,
    },
    input: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiStar,
      mdiStarOutline,
      mdiStarHalfFull,
      selectedStars: null,
      hoverStars: null,
    }
  },
  computed: {
    rating() {
      return this.hoverStars !== null
        ? this.hoverStars
        : this.selectedStars !== null
        ? this.selectedStars
        : this.stars
    },
  },
  methods: {
    hover(stars) {
      if (this.input) {
        this.hoverStars = stars

        this.$emit('hover', stars)
      }
    },
    rate(stars) {
      if (this.input) {
        this.selectedStars = stars

        this.$emit('rate', stars)
      }
    },
  },
}
</script>
