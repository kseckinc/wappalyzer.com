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
    <v-col cols="12" sm="8">
      <v-responsive height="30" class="d-flex align-center mb-2">
        <v-icon color="primary" left>{{ mdi[product.icon] }}</v-icon>

        <span class="overline font-weight-bold">{{ product.title }}</span>
      </v-responsive>

      <h2 class="mb-2">
        {{ product.subtitle }}
      </h2>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="mb-8" v-html="product.text" />
      <v-form
        v-if="product.search"
        ref="form"
        @submit.prevent="$router.push(`/lookup/${encodeURIComponent(url)}/`)"
      >
        <v-text-field
          v-model="url"
          label="Website URL or company name"
          placeholder="Example or example.com"
          style="max-width: 500px"
          :append-icon="mdi.mdiMagnify"
          hide-details
          @click:append="$router.push(`/lookup/${encodeURIComponent(url)}/`)"
        />
      </v-form>
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
        large
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
  mdiPowerPlug,
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
        mdiPowerPlug,
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
