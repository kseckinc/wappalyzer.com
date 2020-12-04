<template>
  <div>
    <Page :title="title" secure>
      <v-row>
        <v-col cols="6" md="4">
          <v-card @click="$router.push('/integrations/hubspot/')">
            <v-responsive :aspect-ratio="4 / 3">
              <v-card-text class="pb-0">
                <div class="mb-4">
                  <v-icon color="#ff7a59" x-large>
                    {{ mdiHubspot }}
                  </v-icon>
                </div>

                <h2 class="mb-2">HubSpot</h2>

                <p>
                  See the technology stacks of your leads in your CRM.
                </p>
              </v-card-text>
            </v-responsive>
          </v-card>
        </v-col>

        <v-col cols="6" md="4">
          <v-card
            @click="
              goto(
                'https://zapier.com/developer/public-invite/9758/f2e8bd2517895d4ffb869e3281e2050f/'
              )
            "
          >
            <v-responsive :aspect-ratio="4 / 3">
              <v-card-text class="pb-0">
                <div class="mb-4">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                  >
                    <path
                      d="M159.999 128.056a76.55 76.55 0 0 1-4.915 27.024 76.745 76.745 0 0 1-27.032 4.923h-.108c-9.508-.012-18.618-1.75-27.024-4.919A76.557 76.557 0 0 1 96 128.056v-.112a76.598 76.598 0 0 1 4.91-27.02A76.492 76.492 0 0 1 127.945 96h.108a76.475 76.475 0 0 1 27.032 4.923 76.51 76.51 0 0 1 4.915 27.02v.112zm94.223-21.389h-74.716l52.829-52.833a128.518 128.518 0 0 0-13.828-16.349v-.004a129 129 0 0 0-16.345-13.816l-52.833 52.833V1.782A128.606 128.606 0 0 0 128.064 0h-.132c-7.248.004-14.347.62-21.265 1.782v74.716L53.834 23.665A127.82 127.82 0 0 0 37.497 37.49l-.028.02A128.803 128.803 0 0 0 23.66 53.834l52.837 52.833H1.782S0 120.7 0 127.956v.088c0 7.256.615 14.367 1.782 21.289h74.716l-52.837 52.833a128.91 128.91 0 0 0 30.173 30.173l52.833-52.837v74.72a129.3 129.3 0 0 0 21.24 1.778h.181a129.15 129.15 0 0 0 21.24-1.778v-74.72l52.838 52.837a128.994 128.994 0 0 0 16.341-13.82l.012-.012a129.245 129.245 0 0 0 13.816-16.341l-52.837-52.833h74.724c1.163-6.91 1.77-14 1.778-21.24v-.186c-.008-7.24-.615-14.33-1.778-21.24z"
                      fill="#FF4A00"
                    />
                  </svg>
                </div>

                <h2 class="mb-2">Zapier</h2>

                <p>
                  Connect Wappalyzer to the apps you use, no code required.
                </p>
              </v-card-text>
            </v-responsive>
          </v-card>
        </v-col>
        <!--
        <v-col cols="6" md="4">
          <v-card @click="goto('https://www.integromat.com/app/wappalyzer/2')">
            <v-responsive :aspect-ratio="4 / 3">
              <v-card-text class="pb-0">
                <div class="mb-4">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 380 381"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M126.693 11.8183V81.3469C88.8588 103.249 63.3844 144.173 63.3844 191.001C63.3844 260.881 120.119 317.616 190.001 317.616C259.884 317.616 316.618 260.881 316.618 191.001C316.618 144.173 291.144 103.249 253.31 81.3469V11.8183C327.089 37.9173 380 108.329 380 191.001C380 295.863 294.865 381 190.001 381C85.1372 381 3.05176e-05 295.863 3.05176e-05 191.001C3.05176e-05 108.329 52.9154 37.9173 126.693 11.8183V11.8183Z"
                      fill="#CCCCCC"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M158.347 3.62921C168.643 1.90023 179.216 0.997681 190.001 0.997681C200.786 0.997681 211.36 1.90023 221.655 3.62921V68.3792C211.538 65.7715 200.929 64.3844 190.001 64.3844C179.074 64.3844 168.465 65.7715 158.347 68.3792V3.62921Z"
                      fill="#308CBB"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M158.347 249.037V101.451C168.251 97.9435 178.905 96.0386 190.001 96.0386C201.097 96.0386 211.752 97.9435 221.655 101.451V249.037C211.752 252.543 201.097 254.45 190.001 254.45C178.905 254.45 168.251 252.543 158.347 249.037Z"
                      fill="#308CBB"
                    />
                  </svg>
                </div>

                <h2 class="mb-2">Integromat</h2>

                <p>
                  Automate technology lookups without a developer.
                </p>
              </v-card-text>
            </v-responsive>
          </v-card>
        </v-col>
        -->
      </v-row>
    </Page>
  </div>
</template>

<script>
import { mdiHubspot } from '@mdi/js'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Integrations',
      mdiHubspot,
    }
  },
  methods: {
    goto(url) {
      window.open(url)
    },
  },
}
</script>
