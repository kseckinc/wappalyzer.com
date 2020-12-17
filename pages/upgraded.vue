<template>
  <client-only>
    <Page
      :title="title"
      :hero="{
        title: 'Wappalyzer has been upgraded',
        subtitle: release ? release.version : error ? '' : '...',
      }"
      :crumbs="false"
      no-head
    >
      <v-row justify="center" class="my-4">
        <v-col cols="12" sm="8" lg="6" class="py-0">
          <v-card>
            <v-card-title>Changelog</v-card-title>

            <v-card-text v-if="error" class="px-0">
              <v-alert color="error" class="mx-4 mb-0" outlined>
                The changelog could not be loaded at this time.
              </v-alert>
            </v-card-text>
            <div
              v-if="!release && !error"
              class="d-flex justify-center py-2 pb-6"
            >
              <Progress />
            </div>
            <template v-if="release">
              <div v-for="type in ['add', 'fix', 'new']" :key="type">
                <template v-if="release.items[type].length">
                  <v-card-title v-if="type === 'add'" class="subtitle-2">
                    <v-icon left>{{ mdiPlusBox }}</v-icon>
                    Additions
                  </v-card-title>
                  <v-card-title v-if="type === 'fix'" class="subtitle-2">
                    <v-icon left>{{ mdiAutoFix }}</v-icon>
                    Improvements
                  </v-card-title>
                  <v-card-title v-if="type === 'new'" class="subtitle-2">
                    <v-icon left>{{ mdiStar }} </v-icon>
                    Features
                  </v-card-title>
                  <v-card-text class="px-0">
                    <v-simple-table>
                      <tbody>
                        <tr
                          v-for="(item, index) in release.items[type]"
                          :key="index"
                        >
                          <td>{{ item }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-card-text>
                </template>
              </div>
            </template>
          </v-card>
        </v-col>
      </v-row>

      <template v-slot:header>
        <v-sheet color="secondary elevation-1" tile>
          <v-container class="text-center body-2 py-6">
            <p>
              Create lists of websites that use certain technologies.<br />
              Lead lists include email addressess and phone numbers.
            </p>

            <v-btn to="/lists/" color="primary">
              <v-icon left>{{ mdiFilterVariant }}</v-icon>
              Create a lead list
            </v-btn>

            <v-btn
              color="primary"
              class="ml-2"
              outlined
              @click="videoDialog = true"
            >
              <v-icon left>{{ mdiPlay }}</v-icon>
              Watch screencast</v-btn
            >
          </v-container>
        </v-sheet>
      </template>

      <v-dialog v-model="videoDialog" max-width="1000" eager>
        <v-card>
          <div class="iframe-container">
            <iframe
              src="https://player.vimeo.com/video/476996233"
              width="100%"
              height="800px"
              max-height="100%"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            ></iframe>
          </div>
        </v-card>
      </v-dialog>

      <script src="https://player.vimeo.com/api/player.js"></script>
    </Page>
  </client-only>
</template>

<script>
import {
  mdiPlusBox,
  mdiAutoFix,
  mdiStar,
  mdiFilterVariant,
  mdiPlay,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Progress from '~/components/Progress.vue'

export default {
  components: {
    Page,
    Progress,
  },
  data() {
    return {
      title: 'Upgraded',
      mdiPlusBox,
      mdiAutoFix,
      mdiStar,
      release: null,
      error: false,
      mdiFilterVariant,
      mdiPlay,
      videoDialog: false,
    }
  },
  watch: {
    videoDialog(open) {
      if (open) {
        this.player.play()
      } else {
        this.player.pause()
      }
    },
  },
  async mounted() {
    try {
      this.release = (await this.$axios.get(this.$config.RELEASE_URL)).data
    } catch (error) {
      this.error = this.getErrorMessage(error)
    }

    const iframe = document.querySelector('iframe')

    this.player = new window.Vimeo.Player(iframe)
  },
}
</script>
