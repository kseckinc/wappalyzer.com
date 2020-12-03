<template>
  <div>
    <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
      <h1 class="mb-4">
        HubSpot
      </h1>

      <p>
        Connect Wappalyzer to
        <a
          href="https://app.hubspot.com/ecosystem/8898653/marketplace/apps/marketing/lead-generation/wappalyzer-by-wappalyzer"
          rel="noopener"
          target="_blank"
          >HubSpot</a
        >
        to see the technology stacks of your leads without leaving your CRM.
      </p>

      <p>
        When installed, a card is added to the sidebar on company records in
        HubSpot. In addition to technologies, you'll also see any email
        addresses, phone numbers, social media profiles, trackers and website
        meta data we have on record.
      </p>

      <v-alert :icon="mdiLightbulbOnOutline" class="mt-6" outlined>
        HubSpot fetches technology data from Wappalyzer every time you view a
        company record. When you uninstall the Wappalyzer app, this information
        is longer available.
      </v-alert>

      <Heading id="getting-started" size="2" class="mt-8 mb-2">
        Getting started
      </Heading>

      <ul>
        <li>
          Go to the
          <nuxt-link to="/integrations/hubspot/"
            >HubSpot integration page</nuxt-link
          >
          in your account.
        </li>
        <li>
          Click 'Connect' and follow the prompts.
        </li>
      </ul>

      <Heading id="pricing" size="2" class="mt-8 mb-2">
        Pricing
      </Heading>

      <p>
        A lookup costs 1 credit. A lookup happens when you view a company record
        in HubSpot. Subsequent lookups for the same record are free for one day.
      </p>

      <p>
        The HubSpot integration is available on any plan. There is no setup fee
        or minimum spend. When you have no remaining credits, no new lookups
        will be performed until you top-up your account.
      </p>

      <p>
        Refer to the <nuxt-link to="/pricing/">Pricing</nuxt-link> page for more
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
      title: 'HubSpot',
      side,
      mdiLightbulbOnOutline,
      crumbs: [
        { title: 'Developer documentation', to: '/docs/' },
        { title: 'Integrations', to: '/docs/integrations/' },
      ],
    }
  },
}
</script>
