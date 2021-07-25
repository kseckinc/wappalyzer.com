<template>
  <div>
    <Page :title="title" no-head>
      <h1 class="text-h1 mb-8" style="font-size: 3rem !important">
        {{ title }}
      </h1>

      <v-row>
        <v-col cols="12" lg="8" class="py-0">
          <p class="text-h2 mb-6">
            {{ intro }}
          </p>
        </v-col>
      </v-row>

      <slot />

      <v-divider class="my-8" />

      <v-row justify="center" justify-md="space-between">
        <v-col v-for="feature in features" :key="feature.text" cols="6" md="3">
          <div class="mb-2 d-flex align-center">
            <v-avatar color="primary lighten-1" size="48">
              <v-icon color="primary" size="24">
                {{ mdi[feature.icon] }}
              </v-icon>
            </v-avatar>
            <div class="body-2 font-weight-medium primary--text ml-4">
              {{ feature.text }}
            </div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4 my-sm-6" />

      <v-card style="max-width: 800px; margin: 0 auto">
        <Vimeo id="476996233" height="600px" />
      </v-card>

      <template v-for="(product, index) in products">
        <v-divider class="my-4 my-sm-6" />

        <Product :name="product" :mirror="!!(index % 2)" />
      </template>

      <template #footer>
        <Logos apps />
      </template>
    </Page>
  </div>
</template>

<script>
import {
  mdiLayers,
  mdiDomain,
  mdiPhone,
  mdiLinkedin,
  mdiTrafficLight,
  mdiChartTimelineVariantShimmer,
  mdiConsole,
  mdiFileTableOutline,
  mdiEarth,
  mdiBullseyeArrow,
  mdiChartDonut,
  mdiIncognito,
  mdiLaptop,
  mdiBellOutline,
  mdiFaceAgent,
  mdiClockFast,
  mdiNumeric,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import Product from '~/components/Product.vue'
import Vimeo from '~/components/Vimeo.vue'
import useCases from '~/assets/json/usecases.json'

export default {
  components: {
    Page,
    Logos,
    Product,
    Vimeo,
  },
  props: {
    name: {
      type: String,
    },
  },
  data() {
    return {
      title: useCases[this.name].title,
      intro: useCases[this.name].intro,
      products: useCases[this.name].products,
      features: useCases[this.name].features,
      mdi: {
        mdiLayers,
        mdiDomain,
        mdiPhone,
        mdiLinkedin,
        mdiTrafficLight,
        mdiChartTimelineVariantShimmer,
        mdiConsole,
        mdiFileTableOutline,
        mdiEarth,
        mdiBullseyeArrow,
        mdiChartDonut,
        mdiIncognito,
        mdiLaptop,
        mdiBellOutline,
        mdiFaceAgent,
        mdiClockFast,
        mdiNumeric,
      },
    }
  },
}
</script>
