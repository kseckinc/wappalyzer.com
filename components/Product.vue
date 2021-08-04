<template>
  <v-row align="center" justify="center" class="pt-lg-4 pb-lg-6">
    <v-col
      class="d-none d-md-block"
      :order-sm="mirror ? 0 : 12"
      cols="12"
      order="12"
      md="4"
    >
      <v-row justify="center">
        <v-col cols="8" sm="12" xl="8" class="py-0">
          <ProductImage
            v-if="product.image"
            :name="product.image"
            :class="mirror ? 'pr-sm-12' : 'pl-sm-12'"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="8">
      <v-responsive height="30" class="d-flex align-center mb-2">
        <v-icon color="primary" left>
          {{ mdi[product.icon] }}
        </v-icon>

        <span class="overline font-weight-bold">{{ product.title }}</span>
      </v-responsive>

      <h2 class="mb-2">
        {{ product.subtitle }}
      </h2>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="mb-8" v-html="product.text" />

      <v-alert
        v-if="name === 'lists'"
        color="secondary"
        class="mt-n2 mb-6 py-2"
      >
        List all
        <v-chip
          color="primary lighten-1 primary--text"
          class="my-1"
          style="vertical-align: inherit"
          label
        >
          Fashion
        </v-chip>
        websites that use
        <v-chip
          color="primary lighten-1 primary--text"
          class="my-1"
          style="vertical-align: inherit"
          label
        >
          Shopify
        </v-chip>
        in
        <v-chip
          color="primary lighten-1 primary--text"
          class="my-1"
          style="vertical-align: inherit"
          label
        >
          United States
        </v-chip>
        with
        <v-chip
          color="primary lighten-1 primary--text"
          class="my-1"
          style="vertical-align: inherit"
          label
        >
          high traffic
        </v-chip>
      </v-alert>

      <v-btn
        v-for="(button, index) in product.buttons"
        :key="index"
        :to="button.to"
        :href="button.href"
        :target="button.href ? '_blank' : '_self'"
        :color="button.secondary ? 'primary lighten-1' : 'primary'"
        :class="`mb-2 mr-4${button.secondary ? ' primary--text' : ''}`"
        large
        depressed
      >
        {{ button.text }}
        <v-icon right>
          {{ mdi[button.icon] }}
        </v-icon>
      </v-btn>

      <div class="overline pt-4">Highlights</div>

      <div
        v-for="feature in product.features"
        :key="feature"
        class="body-2 d-flex align-start pt-2 grey--text"
      >
        <v-icon color="success" dense left>
          {{ mdi.mdiCheck }}
        </v-icon>
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
  mdiFileOutline,
  mdiUpload,
  mdiConsole,
  mdiBookOpenPageVariant,
  mdiBellOutline,
  mdiPuzzle,
  mdiDownload,
  mdiAccountMultiple,
  mdiPowerPlug,
  mdiEmailCheckOutline,
  mdiEarth,
  mdiEmail,
} from '@mdi/js'

import ProductImage from '~/components/ProductImage.vue'
import meta from '~/assets/json/meta.json'

export default {
  components: {
    ProductImage,
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
      url: '',
      email: '',
      mdi: {
        mdiCheck,
        mdiLayersOutline,
        mdiMagnify,
        mdiFilterVariant,
        mdiArrowRight,
        mdiFileTableOutline,
        mdiFileOutline,
        mdiUpload,
        mdiConsole,
        mdiBookOpenPageVariant,
        mdiBellOutline,
        mdiPuzzle,
        mdiDownload,
        mdiAccountMultiple,
        mdiPowerPlug,
        mdiEmailCheckOutline,
        mdiEarth,
        mdiEmail,
      },
    }
  },
  computed: {
    product() {
      return meta[this.name]
    },
  },
}
</script>
