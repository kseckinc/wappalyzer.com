<template>
  <Page :crumbs="crumbs" :title="title" no-head narrow>
    <article>
      <h1 class="text-h1 mb-8">{{ title }}</h1>

      <p>
        Technographics is a market research methodology used to profile target
        accounts based on their technology stack. For many companies, especially
        those offering a SaaS product, the technology a prospect uses can be a
        strong qualifying factor.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Why does technograpics matter?
      </h2>

      <p>
        Much like how demographics and firmographics describe people and
        companies, technographics describe the technologies used by a target
        audience. With technographic data, sales and marketing teams can gain an
        understanding of a company’s technology investments and buying signals.
      </p>

      <p>
        Technographics profiling enables you to answer questions like:
      </p>

      <ul class="mb-4">
        <li>What commerce software does our target audience use?</li>
        <li>Do they offer and use cloud-based solutions?</li>
        <li>Do they invest in marketing automation?</li>
      </ul>

      <p>
        Technographic data allows you to know who you're up against and stay
        competitive.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Technographics in sales and marketing
      </h2>

      <p>
        Technographic data reveals who uses the product or services offered by
        your competitors. Sales and marketing teams can use technographic
        insights to qualify leads, tailor the sales process with personalized
        messages and identify new market opportunities.
      </p>

      <p>
        Technographics helps paint a picture of your target audience before
        engaging and converting them into customers.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Accessing technographic data
      </h2>

      <p>
        Wappalyzer has pioneered the field of technographics for more than a
        decade. We track the websites of millions of companies and the
        technologies they use. Our easy-to-use tools make technographic data
        accessible to anyone.
      </p>

      <p>
        Create lists of websites that use certain technologies with
        <nuxt-link to="/lists">Lead lists</nuxt-link>, including email
        addresses, phone numbers and LinkedIn profiles.
      </p>

      <p>
        Use <nuxt-link to="/lists">Bulk lookup</nuxt-link> to enrich your own
        list of websites with technographic data.
      </p>

      <p>
        Monitor your prospects' technology stack with
        <nuxt-link to="/alerts">Alerts</nuxt-link>, notifying you of any changes
        via email.
      </p>

      <p>
        Or, automate using our <nuxt-link to="/api">APIs</nuxt-link>. We offer
        instant technology lookups and real-time scraping of websites.
      </p>
    </article>
  </Page>
</template>

<script>
import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'What is technographics?',
      crumbs: [{ title: 'Articles', to: '/articles' }],
    }
  },
}
</script>
