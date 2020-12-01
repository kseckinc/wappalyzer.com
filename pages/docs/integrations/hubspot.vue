<template>
  <div>
    <Page :title="title" :side="side" no-hero no-head>
      <h1 class="mb-4">
        HubSpot
      </h1>

      <p>
        Connect Wappalyzer to HubSpot to bring website technology information
        into your CRM.
      </p>

      <Heading id="installation" size="2" class="mt-8 mb-2">
        Installation
      </Heading>

      <ul>
        <li>
          Navigate to the
          <nuxt-link to="/integrations/hubspot/"
            >HubSpot integration page</nuxt-link
          >
        </li>
        <li>
          Click 'Connect' and follow the prompts.
        </li>
        <li>
          Company records in HubSpot now have a Wappalyzer card in the sidebar.
        </li>
      </ul>
    </Page>
  </div>
</template>

<script>
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
    }
  },
}
</script>
