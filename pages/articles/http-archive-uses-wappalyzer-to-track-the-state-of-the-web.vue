<template>
  <Page :crumbs="crumbs" :title="title" :head="{ meta }" no-head narrow>
    <article>
      <h1 class="text-h1 mb-8">
        {{ title }}
      </h1>

      <p>
        The
        <a href="https://httparchive.org/" rel="noopener" target="_blank"
          >HTTP Archive</a
        >
        tracks how the web is built. It provides historical data to
        quantitatively illustrate how the web is evolving over time. The project
        is open-source and backed by technology giants such as Google, Mozilla
        and Akamai.
      </p>

      <p>
        The initiative is part of the
        <a href="https://archive.org/" rel="noopener" target="_blank"
          >Internet Archive</a
        >, a nonprofit organisation that provides free public access to
        digitised materials, including millions of books, software applications
        and websites. Its web archive, the
        <a href="https://archive.org/web/" rel="noopener" target="_blank"
          >Wayback Machine</a
        >, contains hundreds of billions of historical web pages.
      </p>

      <p>
        The HTTP Archive evaluates the composition of millions of web pages on a
        monthly basis and makes its terabytes of metadata
        <a
          href="https://github.com/HTTPArchive/httparchive.org/blob/master/docs/gettingstarted_bigquery.md"
          rel="noopener"
          target="_blank"
          >available for analysis</a
        >
        on BigQuery, a petabyte-scale data warehouse by Google.
      </p>

      <p>
        In one such example,
        <a href="https://twitter.com/paulcalvano" rel="noopener" target="_blank"
          >Paul Calvano</a
        >, web performance architect at Akamai, demonstrates how the dataset can
        be leveraged to analyse
        <a
          href="https://discuss.httparchive.org/t/using-wappalyzer-to-analyze-cpu-times-across-js-frameworks/1336"
          rel="noopener"
          target="_blank"
        >
          CPU times across JavaScript frameworks</a
        >
        with the help of Wappalyzer.
      </p>

      <h2 class="text-h2 mt-8 mb-2">Web Almanac</h2>

      <p>
        Once a year, the HTTP Archive produces a comprehensive 'state of the
        web' report called
        <a
          href="https://almanac.httparchive.org/"
          rel="noopener"
          target="_blank"
          >Web Almanac</a
        >, backed by real data and trusted web experts. Its many chapters span
        aspects of page content, user experience, publishing, and distribution.
        While the Web Almanac is primarily the domain of developers and web
        architects, it's full of helpful stats for content managers, marketers
        and publishers. It's an invaluable resource to understanding how the web
        is trending.
      </p>

      <p>Notable insights in 2019 include:</p>

      <ul class="mb-4">
        <li>
          <nuxt-link to="/technologies/javascript-frameworks/jquery/">
            jQuery
          </nuxt-link>
          is used on 85% of web pages
        </li>
        <li>10% of pages are on an ecommerce platform</li>
        <li>40% of pages are powered by a CMS</li>
        <li>Only 20% of sites serve HTML content via a CDN</li>
        <li>At the 90th percentile, 91% of bytes on pages are from media</li>
      </ul>

      <p>
        In addition to tools such as Google's
        <a
          href="https://developers.google.com/web/tools/lighthouse/"
          rel="noopener"
          target="_blank"
          >Lighthouse</a
        >
        and
        <a
          href="https://developers.google.com/web/tools/chrome-user-experience-report"
          rel="noopener"
          target="_blank"
          >Chrome UX Report</a
        >, The HTTP Archive adopted Wappalyzer to segment reports and help break
        down the aggregate analysis of how the web is doing by various
        technologies. The Web Almanac project uses Wappalyzer extensively as a
        way to compare the performance of all technologies within a category,
        such as CMS and ecommerce.
      </p>

      <v-card class="my-8">
        <v-img
          src="/images/articles/top-ecommerce-platforms.png"
          alt="Top ecommerce platforms"
        />
      </v-card>

      <p>
        The Web Almanac is the brainchild of
        <a
          href="https://twitter.com/rick_viscomi"
          rel="noopener"
          target="_blank"
          >Rick Viscomi</a
        >, a software engineer and web performance evangelist at Google, who
        noted that Wappalyzer is well-aligned with their principles of web
        transparency because of its open and community-driven approach to
        software development.
      </p>

      <h2 class="text-h2 mt-8 mb-2">WebPageTest</h2>

      <p>
        <a href="https://www.webpagetest.org/" rel="noopener" target="_blank"
          >WebPageTest</a
        >, created by Catchpoint software engineer
        <a href="https://twitter.com/patmeenan" rel="noopener" target="_blank"
          >Patrick Meenan</a
        >, is a prominent web performance testing tool and the backbone of HTTP
        Archive. It makes use of Wappalyzer's profiling methods to analyse web
        pages and create security and performance reports.
      </p>

      <h2 class="text-h2 mt-8 mb-2">Conclusion</h2>

      <p>
        Successful societies and institutions recognise the need to record their
        history, providing a way to review the past, find explanations for
        current behavior, and spot emerging trends. The HTTP Archive provides a
        permanent record of how digitised content is constructed and served.
      </p>

      <p>
        Wappalyzer is proud to play a part and continues to work directly with
        core maintainers of the HTTP Archive project to add and improve
        technology fingerprints and methods of inspection.
      </p>
    </article>

    <template #footer>
      <Logos apps use-cases />
    </template>
  </Page>
</template>

<script>
import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'

export default {
  components: {
    Page,
    Logos,
  },
  data() {
    return {
      title: 'HTTP Archive uses Wappalyzer to track the state of the web',
      crumbs: [{ title: 'Articles', to: '/articles/' }],
      meta: '',
    }
  },
}
</script>
