<template>
  <v-row align="stretch">
    <v-col
      v-for="{ name, role, text, image } in testimonials"
      :key="name"
      cols="12"
      sm="6"
      md="4"
      class="d-flex py-0"
    >
      <Testimonial
        :name="name"
        :role="role"
        :text="text"
        :image="image"
        height="100%"
      />
    </v-col>
  </v-row>
</template>

<script>
import Testimonial from '~/components/Testimonial.vue'

import testimonials from '~/assets/json/testimonials.json'

export default {
  components: {
    Testimonial,
  },
  data() {
    return {
      testimonials,
    }
  },
}
</script>
