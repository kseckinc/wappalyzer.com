<template>
  <Page
    :title="title"
    :hero="{
      title: 'Thanks for signing up!',
    }"
    :crumbs="false"
    no-head
  >
    <article>
      <v-row class="mb-6" justify="center" no-gutters>
        <v-col sm="10" lg="8">
          <h1 class="text-h1 mb-8">Where to next?</h1>

          <p class="body-1">
            You now have access to all our products, including lead lists and
            technology lookups. Every month, we'll deposit 50 credits into your
            account for free. You can spend these however you like.
          </p>

          <p class="body-1">
            You can <nuxt-link to="/credits/">top up</nuxt-link> your credits at
            any time or
            <nuxt-link to="/pricing/">sign up for a plan</nuxt-link> to get
            monthly credits at a lower price. Plans also unlock
            <v-chip to="/pro/" color="primary" x-small outlined>PRO</v-chip>
            features, such as CRM integrations and access to company and contact
            details in any of our data products.
          </p>

          <h2 class="text-h2 mt-8 mb-2">Browser extenion</h2>

          <p>
            If you haven't already, install our
            <nuxt-link to="/apps/">free browser extension</nuxt-link> to see the
            technologies used on websites you visit.
          </p>

          <h2 class="text-h2 mt-8 mb-2">Technology lookup</h2>

          <p>
            Use our <nuxt-link to="/lookup/">technology lookup</nuxt-link> tool
            to reveal the technology stack, company and contact details of any
            website, individually or in
            <nuxt-link to="/lookup/#bulk">bulk</nuxt-link>.
          </p>

          <h2 class="text-h2 mt-8 mb-2">Lead lists</h2>

          <p>
            Create a list of websites that use a certain web technology with
            <nuxt-link to="/lists/">lead lists</nuxt-link>. Thousands of
            customers use our lead lists for market research and to find new
            sales prospects. Reach out to companies that use Shopify, Magento,
            WooCommerce or any other software.
          </p>

          <h2 class="text-h2 mt-8 mb-2">Email verification</h2>

          <p>
            We can help improve the quality of your mailing list with
            <nuxt-link to="/verify/">email verification</nuxt-link>. Prevent
            bounces when sending cold emails to avoid getting blocked by major
            email providers such as Gmail and Outlook.
          </p>

          <h2 class="text-h2 mt-8 mb-2">Unlock PRO features</h2>

          <p>
            Sign up for a plan to unlock
            <nuxt-link to="/pro/"
              ><v-chip to="/pro/" color="accent" class="mr-1" x-small outlined
                >PRO</v-chip
              >features</nuxt-link
            >. You get access to additional data points such as company and
            contact details in lead lists, APIs, browser extensions and more.
            Subscribe to an eligible plan to get started immediately or
            <nuxt-link to="/contact/">contact us</nuxt-link> to book a demo!
          </p>
        </v-col>
      </v-row>

      <Pricing />
    </article>

    <template #footer>
      <Logos apps use-cases />
    </template>
  </Page>
</template>

<script>
import Page from '~/components/Page.vue'
import Pricing from '~/components/Pricing.vue'
import Logos from '~/components/Logos.vue'

export default {
  components: {
    Page,
    Pricing,
    Logos,
  },
  data() {
    return {
      title: 'Thanks for signing up',
    }
  },
}
</script>
