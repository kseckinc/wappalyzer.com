<template>
  <div>
    <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
      <h1 class="mb-4">Zapier</h1>

      <p>
        Connect Wappalyzer to the apps and services you use with
        <a
          href="https://zapier.com/developer/public-invite/9758/f2e8bd2517895d4ffb869e3281e2050f/"
          rel="noopener"
          target="_blank"
          >Zapier</a
        >, no code required. Add technology data to contacts in your CRM,
        ticketing system or any other supported platform.
      </p>

      <Heading id="getting-started" size="2" class="mt-8 mb-2">
        Getting started
      </Heading>

      <p>
        To get started, head over to
        <a
          href="https://zapier.com/developer/public-invite/9758/f2e8bd2517895d4ffb869e3281e2050f/"
          rel="noopener"
          target="_blank"
          >Zapier</a
        >
        to create your integration ('Zap'). Refer to the
        <a href="https://zapier.com/help" rel="noopener" target="_blank">
          Help &amp; Support
        </a>
        page to learn more.
      </p>

      <Heading id="pricing" size="2" class="mt-8 mb-2"> Pricing </Heading>

      <p>
        A technology lookup costs 1 credit. Refer to the
        <nuxt-link to="/pricing/">Pricing</nuxt-link> page for more information
        about credits and plans.
      </p>
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
      title: 'Zapier',
      side,
      crumbs: [
        { title: 'Developer documentation', to: '/docs/' },
        { title: 'Integrations', to: '/docs/integrations/' },
      ],
    }
  },
}
</script>
