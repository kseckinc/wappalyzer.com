<template>
  <v-row align="center" justify="center" class="pt-lg-4 pb-lg-6">
    <v-col :order-sm="mirror ? 0 : 12" cols="12" order="12" sm="4">
      <v-row justify="center">
        <v-col cols="8" sm="12" class="py-0">
          <ProductImage
            :name="product.image"
            :class="mirror ? 'pr-sm-12' : 'pl-sm-12'"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="8" lg="6">
      <v-responsive height="30" class="d-flex align-center mb-2">
        <v-icon color="primary" left>{{ mdi[product.icon] }}</v-icon>

        <span class="overline font-weight-bold">{{ product.title }}</span>
      </v-responsive>

      <h2 class="mb-2">
        {{ product.subtitle }}
      </h2>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="mb-8" v-html="product.text" />

      <Technologies
        v-if="product.search"
        class="mt-n4"
        accept-url
        @select="select"
      />
      <v-btn
        v-for="(button, index) in product.buttons"
        v-else
        :key="index"
        :to="button.to"
        :href="button.href"
        :target="button.href ? '_blank' : '_self'"
        :outlined="button.secondary"
        color="primary"
        class="mb-2 mr-2"
        >{{ button.text }}
        <v-icon right>{{ mdi[button.icon] }}</v-icon>
      </v-btn>

      <div class="overline pt-4">Highlights</div>

      <div
        v-for="feature in product.features"
        :key="feature"
        class="body-2 d-flex align-start pt-2 grey--text"
      >
        <v-icon color="success" dense left>{{ mdi.mdiCheck }}</v-icon>
        {{ feature }}
      </div>
    </v-col>
  </v-row>
</template>

<script>
import {
  mdiCheck,
  mdiLayersOutline,
  mdiMagnify,
  mdiFilterVariant,
  mdiArrowRight,
  mdiFileTableOutline,
  mdiUpload,
  mdiConsole,
  mdiBookOpenPageVariant,
  mdiBullhorn,
  mdiPuzzle,
  mdiDownload,
  mdiAccountMultiple,
} from '@mdi/js'

import ProductImage from '~/components/ProductImage.vue'
import Technologies from '~/components/Technologies.vue'
import meta from '~/assets/json/meta.json'

export default {
  components: {
    ProductImage,
    Technologies,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    mirror: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdi: {
        mdiCheck,
        mdiLayersOutline,
        mdiMagnify,
        mdiFilterVariant,
        mdiArrowRight,
        mdiFileTableOutline,
        mdiUpload,
        mdiConsole,
        mdiBookOpenPageVariant,
        mdiBullhorn,
        mdiPuzzle,
        mdiDownload,
        mdiAccountMultiple,
      },
    }
  },
  computed: {
    product() {
      return meta[this.name]
    },
  },
  methods: {
    select(item) {
      if (typeof item === 'string') {
        this.$router.push(`/lookup/?url=${item}`)
      } else if (item.type === 'technology') {
        this.$router.push(
          `/technologies/${item.categories[0].slug}/${item.slug}/`
        )
      } else {
        this.$router.push(`/technologies/${item.slug}/`)
      }
    },
  },
}
</script>
