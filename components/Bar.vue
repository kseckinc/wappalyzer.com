<template>
  <v-sheet class="bar" color="secondary">
    <span class="bar__value bar__value--background mx-1">
      {{ percentage }}%
    </span>
    <v-sheet
      :width="`${(100 / max) * value}%`"
      color="primary"
      class="bar__span white--text"
      height="18"
    >
      <span class="bar__value bar__value--foreground mx-1">
        {{ percentage }}%
      </span>
    </v-sheet>
  </v-sheet>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    percentage() {
      const percentage = (100 / this.total) * this.value

      return percentage.toFixed(
        percentage <= 0.9 ? (percentage <= 0.09 ? 2 : 1) : 0
      )
    },
  },
}
</script>

<style>
.bar {
  position: relative;
}

.bar__value {
  font-size: 0.6rem;
  line-height: 18px;
  white-space: nowrap;
  position: absolute;
  left: 0;
  top: 0;
}

.bar__span {
  overflow: hidden;
  position: relative;
}
</style>
