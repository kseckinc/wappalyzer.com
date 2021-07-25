<template>
  <div class="iframe-container">
    <iframe
      :src="`https://player.vimeo.com/video/${id}`"
      width="100%"
      :height="height"
      max-height="100%"
      frameborder="0"
      allow="autoplay; fullscreen"
      allowfullscreen
    />
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
    },
    height: {
      type: String,
    },
  },
}
</script>

<style>
.iframe-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
}

.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>
