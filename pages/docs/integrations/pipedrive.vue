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
        When installed, a panel is added to the sidebar on people and
        organisations in Pipedrive showing the technologies on used on their
        website.
      </p>

      <v-alert :icon="mdiLightbulbOnOutline" class="mt-6" outlined>
        Pipedrive fetches technology data from Wappalyzer every time you view a
        person or organisation. When you uninstall the Wappalyzer app, this
        information is longer available.
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

      <v-alert :icon="mdiLightbulbOnOutline" class="mt-6" outlined>
        Each Pipedrive user must connect the app individually. Add members to
        your <nuxt-link to="/organisation">organisation</nuxt-link> to allow
        multiple users to use the same plan.
      </v-alert>

      <Heading id="getting-started" size="2" class="mt-8 mb-2">
        Configuration
      </Heading>

      <p>
        For people, Wappalyzer uses the persons's email address to determine the
        website domain and show the technologies in use for that website.
      </p>

      <p>
        For Wappalyzer data to show up on organisations in Pipedrive, you must
        first specify which custom field is used to store the organisation's
        website.
      </p>

      <p>
        In Pipedrive settings, go to
        <v-chip small>Data fields</v-chip>
        &rarr; <v-chip small>Organization</v-chip> &rarr;
        <v-chip small>Custom fields</v-chip> and create or find a custom field
        that contains the website URL for organisations. Hover over the field,
        click the three-dot menu and copy the API key.
      </p>

      <p>
        Add the key to the
        <nuxt-link to="/integrations/pipedrive/"
          >Pipedrive integration page</nuxt-link
        >
        in your account.
      </p>

      <Heading id="pricing" size="2" class="mt-8 mb-2"> Pricing </Heading>

      <p>
        A lookup costs 1 credit. A lookup happens when you view a person or
        organisation in Pipedrive. Subsequent lookups for the same record are
        free for one day.
      </p>

      <p>
        The Pipedrive integration is available on Team and Business plans. When
        you have no remaining credits, no new lookups can be performed until you
        top-up your account.
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
