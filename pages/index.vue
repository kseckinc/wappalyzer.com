<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <Page :title="title" no-crumbs no-head>
      <template v-for="(section, index) in sections">
        <v-divider
          v-if="index"
          :key="`section-${index}`"
          class="my-4 my-sm-6"
        />

        <v-row
          :key="index"
          align="center"
          justify="center"
          class="pt-lg-8 pb-lg-6"
        >
          <v-col
            :order-sm="index % 2 !== 0 ? 0 : 12"
            cols="12"
            order="12"
            sm="4"
          >
            <v-row justify="center">
              <v-col cols="8" sm="12" class="py-0">
                <v-img
                  :class="index % 2 !== 0 ? 'mr-sm-12' : 'ml-sm-12'"
                  :src="`/images/${section.image}`"
                  contain
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="8" lg="6">
            <v-responsive height="30" class="d-flex align-center mb-2">
              <v-icon color="primary" left>{{ section.icon }}</v-icon>

              <span class="overline font-weight-bold">{{ section.title }}</span>
            </v-responsive>

            <h2 class="mb-2">
              {{ section.subtitle }}
            </h2>

            <p class="mb-8" v-html="section.text" />

            <v-btn
              v-for="(button, buttonIndex) in section.buttons"
              :key="`section-${index}-button-${buttonIndex}`"
              :to="button.to"
              :href="button.href"
              :target="button.href ? '_blank' : '_self'"
              :outlined="button.secondary"
              color="primary"
              class="mb-2 mr-2"
              >{{ button.text }}
              <v-icon right>{{ button.icon }}</v-icon>
            </v-btn>

            <div class="overline pt-4">Highlights</div>

            <div
              v-for="feature in section.features"
              :key="feature"
              class="body-2 d-flex align-start pt-2 grey--text"
            >
              <v-icon color="success" dense left>mdi-check</v-icon>
              {{ feature }}
            </div>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import Logos from '~/components/Logos.vue'
import Page from '~/components/Page.vue'
import meta from '~/assets/json/meta.json'

export default {
  components: {
    Logos,
    Page,
  },
  data() {
    return {
      title: meta.hero.title,
      sections: Object.values(meta).filter((meta) => meta.feature),
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: meta.hero.text,
        },
      ],
    }
  },
}
</script>
