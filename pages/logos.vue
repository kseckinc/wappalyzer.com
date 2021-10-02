<template>
  <div>
    <Page :title="title" no-head no-subscribe>
      <h1 class="mt-n2 mb-2">{{ title }}</h1>

      <div style="max-width: 600px" class="mb-8">
        <p>
          You're welcome to use our logos in a blog post or news article about
          Wappalyzer, to advertise that your product has a Wappalyzer
          integration, or when linking to us.
        </p>

        <div class="body-2">
          <p>
            Please don’t modify or distort the logo, change any colors, or add
            additional elements.
          </p>

          <p>
            Wappalyzer is a registered trademark. Avoid using our name or logos
            in a way that implies affiliation or endorsement.
          </p>
        </div>
      </div>

      <v-row>
        <v-col cols="4">
          <v-card>
            <v-card-text align="center">
              <LogoLight class="d-block" width="80%" height="auto" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn to="/images/logo/logo-light.svg" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >SVG</v-btn
              >
              <v-btn to="/images/logo/logo-light.png" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >PNG</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card>
            <v-sheet color="primary" class="pa-4" align="center">
              <LogoDark class="d-block" width="80%" height="auto" />
            </v-sheet>
            <v-card-actions>
              <v-spacer />
              <v-btn to="/images/logo/logo-dark.svg" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >SVG</v-btn
              >
              <v-btn to="/images/logo/logo-dark.png" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >PNG</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card>
            <v-card-text align="center">
              <LogoMono class="d-block" width="80%" height="auto" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn to="/images/logo/logo-mono.svg" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >SVG</v-btn
              >
              <v-btn to="/images/logo/logo-mono.png" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >PNG</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="4">
          <v-card>
            <v-card-text align="center">
              <MarkLight class="d-block" width="80%" height="auto" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn to="/images/logo/mark-light.svg" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >SVG</v-btn
              >
              <v-btn to="/images/logo/mark-light.png" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >PNG</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card>
            <v-sheet color="primary" class="pa-4" align="center">
              <MarkDark class="d-block" width="80%" height="auto" />
            </v-sheet>
            <v-card-actions>
              <v-spacer />
              <v-btn to="/images/logo/mark-dark.svg" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >SVG</v-btn
              >
              <v-btn to="/images/logo/mark-dark.png" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >PNG</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card>
            <v-card-text align="center">
              <MarkMono class="d-block" width="80%" height="auto" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn to="/images/logo/mark-mono.svg" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >SVG</v-btn
              >
              <v-btn to="/images/logo/mark-mono.png" target="_blank" small text
                ><v-icon left>{{ mdiDownload }}</v-icon
                >PNG</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-4">
        <v-col>
          <v-card color="#4608ad" class="pa-2 white--text text-center">
            Primary<br />
            <small>#4608ad</small>
          </v-card>
        </v-col>
        <v-col>
          <v-card color="#1C0172" class="pa-2 white--text text-center">
            Accent<br />
            <small>#1C0172</small>
          </v-card>
        </v-col>
      </v-row>
    </Page>
  </div>
</template>

<script>
import { mdiDownload, mdiCheck, mdiClose } from '@mdi/js'
import Page from '~/components/Page.vue'
import LogoDark from '~/static/images/logo/logo-dark.svg?inline'
import LogoLight from '~/static/images/logo/logo-light.svg?inline'
import LogoMono from '~/static/images/logo/logo-mono.svg?inline'
import MarkDark from '~/static/images/logo/mark-dark.svg?inline'
import MarkLight from '~/static/images/logo/mark-light.svg?inline'
import MarkMono from '~/static/images/logo/mark-mono.svg?inline'

export default {
  components: {
    Page,
    LogoDark,
    LogoLight,
    LogoMono,
    MarkDark,
    MarkLight,
    MarkMono,
  },
  data() {
    return {
      title: 'Logos',
      mdiDownload,
      mdiCheck,
      mdiClose,
    }
  },
}
</script>
