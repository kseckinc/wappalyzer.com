<template>
  <div class="code">
    <slot />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$el.innerHTML = this.$el.innerHTML
      .replace(
        /("|'|`)([^"]+)("|'|`)/g,
        '$1<span class="code__value">$2</span>$3'
      )
      .replace(
        /(": )([^\s"'`{[,]+)(,?)/g,
        '$1<span class="code__value">$2</span>$3'
      )
      .replace(/(\/\/|#) (.+)/g, '<span class="code__comment">$1 $2</span>')
  },
}
</script>

<style>
.code {
  color: #4a4a4a;
  font-size: 0.75rem;
  max-width: 100%;
  overflow-x: auto;
}

.code__comment {
  color: #999;
}

.code__value {
  background-color: #f0ebf9;
  border-radius: 3px;
  color: #4608ad;
  padding: 0.1rem 0.2rem;
}
</style>
