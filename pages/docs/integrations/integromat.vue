<template>
  <div>
    <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
      <h1 class="mb-4">Integromat</h1>

      <p>
        Connect Wappalyzer to the apps and services you use with
        <a
          href="https://www.integromat.com/en/integrations/wappalyzer"
          rel="noopener"
          target="_blank"
          >Integromat</a
        >, no code required. Add technology data to contacts in your CRM,
        ticketing system or any other supported platform.
      </p>

      <Heading id="getting-started" size="2" class="mt-8 mb-2">
        Getting started
      </Heading>

      <p>
        To get started, head over to
        <a
          href="https://www.integromat.com/en/integrations/wappalyzer"
          rel="noopener"
          target="_blank"
          >Integromat</a
        >
        to create your scenario. Refer to the
        <a
          href="https://support.integromat.com/hc/en-us/categories/360000515213-Getting-Started"
          rel="noopener"
          target="_blank"
        >
          Help Center
        </a>
        page to learn more.
      </p>

      <v-alert :icon="mdiLightbulbOnOutline" type="info" class="my-8" text>
        For an in-depth example, see:
        <nuxt-link
          to="/articles/get-the-technology-stack-of-new-leads-in-slack/"
        >
          Get the technology stack of new leads to your Slack instantly </nuxt-link
        >.
      </v-alert>

      <Heading id="pricing" size="2" class="mt-8 mb-2"> Pricing </Heading>

      <p>
        A technology lookup costs 1 credit. Refer to the
        <nuxt-link to="/pricing/"> Pricing </nuxt-link> page for more
        information about credits and plans.
      </p>
    </Page>
  </div>
</template>

<script>
import { mdiLightbulbOnOutline } from '@mdi/js'

import Page from '~/components/Page.vue'
import Heading from '~/components/Heading.vue'
import side from '~/assets/json/nav/docs.json'

export default {
  components: {
    Page,
    Heading,
  },
  data() {
    return {
      title: 'Integromat',
      side,
      crumbs: [
        { title: 'Developer documentation', to: '/docs/' },
        { title: 'Integrations', to: '/docs/integrations/' },
      ],
      mdiLightbulbOnOutline,
    }
  },
}
</script>
