<template>
  <div>
    <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
      <h1 class="mb-4">HubSpot</h1>

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

      <v-alert
        :icon="mdiLightbulbOnOutline"
        color="secondary"
        class="my-8 elevation-1"
      >
        HubSpot fetches technology data from Wappalyzer every time you view a
        company record. When you uninstall the Wappalyzer app, this information
        is longer available.
      </v-alert>

      You can also permanently enrich all company records at once with a sync,
      and automatically update new records using a webhook. This information is
      yours to keep and can be used to create custom reports in HubSpot.

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
        <li>Click 'Connect' and follow the prompts.</li>
      </ul>

      <Heading id="getting-started" size="2" class="mt-8 mb-2">
        Field mappings
      </Heading>

      <p>
        To permanently enrich company records in HubSpot, you must first map
        technology categories in custom company properties in HubSpot (<a
          href="https://knowledge.hubspot.com/crm-setup/manage-your-properties#create-custom-properties"
          target="_blank"
          rel="noopen"
          >see the documentation</a
        >
        on how to create custom properties). The properties can be in any group
        but must of type 'single line text'.
      </p>

      <p>
        To set up field mappings, go to the
        <nuxt-link to="/integrations/hubspot/"
          >HubSpot integration page</nuxt-link
        >
        in your account.
      </p>

      <Heading id="pricing" size="2" class="mt-8 mb-2">Pricing</Heading>

      <p>
        The HubSpot integration is available on
        <v-chip to="/pricing/" color="primary" x-small outlined>PRO</v-chip>
        plans.
      </p>

      <p>
        Permanently enriched records cost 1 credit each. Records can be enriched
        using a sync or organisation webhook. Card usage is free.
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
