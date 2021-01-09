<template>
  <div>
    <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
      <h1 class="mb-4">Pipedrive</h1>

      <p>
        Connect Wappalyzer to
        <a
          href="https://marketplace.pipedrive.com/app/wappalyzer/c13f52b93ab427e3"
          rel="noopener"
          target="_blank"
          >Pipedrive</a
        >
        to see the technology stacks of your leads without leaving your CRM.
      </p>

      <p>
        When installed, a panel is added to the sidebar on contacts in
        Pipedrive. Wappalyzer uses the contact's email address to determine the
        website domain and show the technologies in use for that website.
      </p>

      <v-alert :icon="mdiLightbulbOnOutline" class="mt-6" outlined>
        Pipedrive fetches technology data from Wappalyzer every time you view a
        company record. When you uninstall the Wappalyzer app, this information
        is longer available.
      </v-alert>

      <Heading id="getting-started" size="2" class="mt-8 mb-2">
        Getting started
      </Heading>

      <ul>
        <li>
          Go to the
          <nuxt-link to="/integrations/pipedrive/"
            >Pipedrive integration page</nuxt-link
          >
          in your account.
        </li>
        <li>Click 'Connect' and follow the prompts.</li>
      </ul>

      <Heading id="pricing" size="2" class="mt-8 mb-2"> Pricing </Heading>

      <p>
        A lookup costs 1 credit. A lookup happens when you view a contact in
        Pipedrive. Subsequent lookups for the same record are free for one day.
      </p>

      <p>
        The Pipedrive integration is available on Pro and Business plans. When
        you have no remaining credits, no new lookups will be performed until
        you top-up your account.
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
      title: 'Pipedrive',
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
