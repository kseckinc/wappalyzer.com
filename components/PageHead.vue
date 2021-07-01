<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <v-row v-if="image">
      <v-col md="8" class="py-0">
        <h1 v-if="title" class="mb-4">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="subtitle-2 mt-n4">
          {{ subtitle }}
        </p>

        <template v-if="Array.isArray(text) && text.length">
          <p
            v-for="(paragraph, index) in text"
            :key="index"
            class="head-text"
            v-html="paragraph"
          />
        </template>
        <p v-else-if="text" class="head-text" v-html="text" />

        <Progress v-if="loading" class="mt-8" />

        <v-fade-transition>
          <div v-show="!loading">
            <slot />
          </div>
        </v-fade-transition>
      </v-col>
      <v-col cols="12" md="4" class="d-none d-md-flex align-start pl-12">
        <ProductImage :name="image" />
      </v-col>
    </v-row>
    <template v-else>
      <v-row>
        <v-col :md="narrow ? 12 : 10" :lg="narrow ? 10 : 8" class="py-0">
          <h1 v-if="title" class="mb-4">
            {{ title }}
          </h1>

          <p v-if="subtitle" class="subtitle-2 mt-n4">
            {{ subtitle }}
          </p>

          <template v-if="Array.isArray(text) && text.length">
            <p
              v-for="(paragraph, index) in text"
              :key="index"
              class="head-text"
              v-html="paragraph"
            />
          </template>
          <p v-else-if="text" class="head-text" v-html="text" />
        </v-col>
      </v-row>

      <Progress v-if="loading" />

      <v-fade-transition>
        <div v-show="!loading">
          <slot />
        </div>
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import Progress from '~/components/Progress.vue'
import ProductImage from '~/components/ProductImage.vue'

export default {
  components: {
    Progress,
    ProductImage,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    text: {
      type: [Array, String],
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    narrow: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    Array.from(this.$el.querySelectorAll('.head-text a[href^="/"]')).forEach(
      (link) =>
        link.addEventListener('click', (event) => {
          event.preventDefault()

          this.$router.push(link.pathname)
        })
    )
  },
}
</script>
