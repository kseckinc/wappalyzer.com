<template>
  <div>
    <Page :title="title" narrow no-head>
      <h1 class="text-h1 mb-8">{{ title }}</h1>

      <p class="subtitle-1">
        Wappalyzer offers tools for website profiling, market research and lead
        generation. Sign up for a
        <v-chip color="primary" x-small outlined>PRO</v-chip> plan to unlock
        additional features, such as CRM integrations and access to company and
        contact information.
      </p>

      <v-divider class="mt-12 mb-6" />

      <h2 class="text-h2 mt-8 mb-2 d-flex">
        <v-icon color="primary" class="mr-2">{{ mdiLayersOutline }}</v-icon>

        Technology lookup
      </h2>

      <p>
        Our <nuxt-link to="/lookup/">technology lookup</nuxt-link> tool uncovers
        the technology stack of any website, indivually or
        <nuxt-link to="/lookup/#bulk">in bulk</nuxt-link>. Sign up for a
        <v-chip color="primary" x-small outlined>PRO</v-chip> plan to instantly
        see company and contact information, as well as social media profiles
        and other data points.
      </p>

      <v-card class="my-8">
        <v-img
          src="/images/faqs/lookup-pro.png"
          alt="Wappalyzer PRO technology lookup"
        />
      </v-card>

      <v-divider class="mt-12 mb-6" />

      <h2 class="text-h2 mt-8 mb-2 d-flex">
        <v-icon color="primary" class="mr-2">{{ mdiFilterVariant }}</v-icon>

        Lead lists
      </h2>

      <p>
        With <nuxt-link to="/lists/">lead lists</nuxt-link> you can create lists
        of websites that use certain technologies or keywords, including basic
        information such as the website's title and description. On a
        <v-chip color="primary" x-small outlined>PRO</v-chip> plan, you also get
        any available company and contact details and social media profiles.
      </p>

      <v-btn href="/list-sample.zip" class="my-2" depressed>
        <v-icon left>{{ mdiDownload }}</v-icon>
        Download a sample list
      </v-btn>

      <v-card class="my-6">
        <v-card-title class="subtitle-2">Fields</v-card-title>
        <v-card-text>
          Fields in bold are exclusive to users on on a
          <v-chip color="primary" x-small outlined>PRO</v-chip> plan.
        </v-card-text>
        <v-divider />
        <v-card-text class="pt-0 pb-7 px-4" style="overflow: hidden">
          <v-row class="mt-4">
            <v-col
              v-for="{ attribute, pro } in attributes"
              :key="attribute.name"
              cols="6"
              md="4"
              :class="`py-0${pro ? ' font-weight-bold primary--text' : ''}`"
            >
              <small>{{ attribute }}</small>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-divider class="mt-12 mb-6" />

      <h2 class="text-h2 mt-8 mb-2 d-flex">
        <v-icon color="primary" class="mr-2">{{ mdiPuzzle }}</v-icon>
        Browser extension
      </h2>

      <p>
        Our free <nuxt-link to="/apps/">browser extension</nuxt-link> shows you
        the technologies use on websites you visit. On a
        <v-chip color="primary" x-small outlined>PRO</v-chip> plan you can view
        available company and contact information as well as any metadata we
        find without leaving the page you're on.
      </p>

      <v-row class="mt-4">
        <v-col cols="6">
          <v-card>
            <v-img
              src="/images/faqs/extension.png"
              alt="Wappalyzer PRO extension"
            />
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-img
              src="/images/faqs/extension-pro.png"
              alt="Wappalyzer PRO extension"
            />
          </v-card>
        </v-col>
      </v-row>

      <v-divider class="mt-12 mb-6" />

      <h2 class="text-h2 mt-8 mb-2 d-flex">
        <v-icon color="primary" class="mr-2">{{ mdiApps }}</v-icon>
        CRM integration
      </h2>

      As a <v-chip color="primary" x-small outlined>PRO</v-chip> user, you get
      access to our CRM integrations in addition to our other
      <nuxt-link to="/apps/">apps</nuxt-link>. See the technologies stacks of
      your leads without leaving your CRM.

      <Apps pro class="my-8" />

      <v-divider class="mt-12 mb-6" />

      <h2 class="text-h2 mt-8 mb-2 d-flex">
        <v-icon color="primary" class="mr-2">{{ mdiConsole }}</v-icon>
        APIs
      </h2>

      <p>
        Our <nuxt-link to="/api/">Lookup and Live APIs</nuxt-link> grant instant
        and real-time access to website technology stacks and metadata. On a
        <v-chip color="primary" x-small outlined>PRO</v-chip> plan, all
        available company and contact information is returned as well, allowing
        you to enrich your own datasets at scale.
      </p>

      <v-btn to="/docs/api/" depressed>
        <v-icon left>{{ mdiBookOpenPageVariant }}</v-icon>
        API reference
      </v-btn>

      <div class="mt-8 pa-8 text-center">
        <v-btn to="/pricing/" color="primary" depressed x-large
          >Compare plans
          <v-icon right>{{ mdiArrowRight }}</v-icon>
        </v-btn>
      </div>

      <template #footer>
        <Logos apps use-cases />
      </template>
    </Page>
  </div>
</template>

<script>
import {
  mdiArrowRight,
  mdiLayersOutline,
  mdiFilterVariant,
  mdiPuzzle,
  mdiApps,
  mdiConsole,
  mdiDownload,
  mdiBookOpenPageVariant,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import Apps from '~/components/Apps.vue'
import sets from '~/assets/json/sets'

export default {
  components: {
    Page,
    Logos,
    Apps,
  },
  data() {
    return {
      title: 'PRO features',
      mdiArrowRight,
      mdiLayersOutline,
      mdiFilterVariant,
      mdiPuzzle,
      mdiApps,
      mdiConsole,
      mdiDownload,
      mdiBookOpenPageVariant,
    }
  },
  computed: {
    attributes() {
      return sets
        .filter(({ disabled }) => !disabled)
        .map(({ attributes, pro }) => {
          return attributes.map(({ name, key }) => {
            const attribute = name || key

            return {
              attribute: attribute.charAt(0).toUpperCase() + attribute.slice(1),
              pro,
            }
          })
        })
        .flat()
        .sort(({ attribute: a }, { attribute: b }) =>
          a.charCodeAt(0) > b.charCodeAt(0) ? 1 : -1
        )
    },
  },
}
</script>
