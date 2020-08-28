<template>
  <Page :crumbs="crumbs" :title="title" :head="{ meta }" no-head narrow>
    <article>
      <h1 class="text-h1 mb-8">{{ title }}</h1>

      <h2 class="text-h2 mt-8 mb-2"></h2>

      <p>
        Wappalyzer, BuiltWith and Datanyze are data vendors that scan websites
        to identify technologies. When looking for providers in the
        <nuxt-link to="/articles/what-is-technographics/"
          >technographics</nuxt-link
        >
        space, Wappalyzer is often mentioned as a BuiltWith alternative or
        Datanyze alternative.
      </p>

      <p>
        Whilst the three companies have similarities in their offerings, there
        are of course differences, some of which we'll highlight here.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Open-source core
      </h2>

      <p>
        Wappalyzer is the only web technology profiler built on an open-source
        core. The advantages of open-source software are undeniable:
      </p>

      <ul>
        <li>
          <strong>Crowd-sourced development.</strong> Hundreds of developers
          have helped improve Wappalyzer over the years and continue to do so
          every day. Anyone can add new technologies and help improve existing
          technology fingerprints.
        </li>
        <li>
          <strong>Transparency.</strong> Developing in the open means more eyes
          on the code base and inaccuracies get fixed faster. In contrast,
          proprietary software developed in secrecy by a single team or company
          tends to be updated at a much slower rate.
        </li>
        <li>
          <strong>Reliability.</strong> Code is developed on online forums,
          guided by experts. The output is extremely robust, tried and tested
          code. Open-source code powers about 90% of the internet and is being
          widely adopted across major enterprises for this reason.
        </li>
      </ul>

      <h2 class="text-h2 mt-8 mb-2">
        Data accuracy
      </h2>

      <p>
        Wappalyzer is known to be the most accurate technology profiler. While
        others focus on quantity, Wappalyzer's primary goal is to be the best at
        what it does.
      </p>

      <p>
        Thanks to its large user base and community of open-source developers
        across the globe, Wappalyzer's technology fingerprints are under
        constant scrutiny. Improvements are made daily and rolled out quickly.
      </p>

      <p>
        Wappalyzer's data is being updated continuously to ensure only live,
        actively visited websites are included in technology lookups and lead
        lists.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Browser extensions
      </h2>

      <p>
        Wappalyzer's free and immensely popular
        <nuxt-link to="/download/">browser extension</nuxt-link> has more users
        than all the competition combined: more than a million people use it on
        a daily basis. The reason this matters is because more users results in
        more websites being discovered and a larger sample size to accurately
        determine website traffic. A passionate user base also provides
        invaluable feedback that helps improve the product.
      </p>

      <p>
        Wappalyzer's browser extension analyses websites inside the browser,
        which means it functions offline and even on local networks.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Organic data
      </h2>

      <p>
        Data collected through the browser extension is entirely organic. In
        contrast, scanning websites with web crawlers alone doesn't reveal a
        website's popularity or frequency of visits by real people. Wappalyzer's
        data is largely sourced from the browser extension and supplemented by
        in-house crawlers to fetch additional types of information, such as
        contact details and metadata.
      </p>

      <p>
        Because of this method, Wappalyzer can analyse and index websites
        inaccessible to crawlers, such as those behind a login.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Accessible and easy to use
      </h2>

      <p>
        Wappalyzer's products are designed to be highly accessible and easy to
        use by anyone. The browser extension is free forever and does not
        require an account. You do not need an expensive subscription to access
        any of Wappalyzer's products, including its APIs.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Laser focus
      </h2>

      <p>
        Wappalyzer's mission is to do one thing, and do it extremely well. For
        over a decade, its sole focus has been on
        <nuxt-link to="/articles/what-is-technographics/"
          >technographics</nuxt-link
        >. The company has remained independent for over a decade and built a
        reputation for being the best and most accurate web technology profiler.
      </p>

      <v-divider class="my-12" />

      <p>
        Create lists of websites that use certain technologies with
        <nuxt-link to="/lists/">Lead lists</nuxt-link>, including email
        addresses, phone numbers and LinkedIn profiles.
      </p>

      <p>
        Use <nuxt-link to="/lists/">Bulk lookup</nuxt-link> to enrich your own
        list of websites with technographic data.
      </p>

      <p>
        Monitor your prospects' technology stack with
        <nuxt-link to="/alerts/">Alerts</nuxt-link>, notifying you of any
        changes via email.
      </p>

      <p>
        Or, automate using our <nuxt-link to="/api/">APIs</nuxt-link>. We offer
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
      title: 'Wappalyzer vs. BuiltWith and Datanyze',
      crumbs: [{ title: 'Articles', to: '/articles/' }],
      meta: `Looking for an alternative to BuiltWith or Datanyze? Compare technograpic data vendors and technology profilers.`,
    }
  },
}
</script>
