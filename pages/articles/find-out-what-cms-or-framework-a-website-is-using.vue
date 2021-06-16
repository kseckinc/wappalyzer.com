<template>
  <Page :crumbs="crumbs" :title="title" :head="{ meta }" no-head narrow>
    <article>
      <h1 class="text-h1 mb-8">{{ title }}</h1>

      <p>
        Whether you're a developer, online marketer, security researcher or SEO
        consultant, you've likely looked at a website and wondered 'what CMS is
        this website using'? There are several ways to check the technology of a
        website, which we'll explore in detail.
      </p>

      <h2 class="text-h2 mt-8 mb-2">The easy way</h2>

      <p>
        To instantly find out what CMS, framework or ecommerce platform a
        website is using, install the
        <nuxt-link to="/apps/">Wappalyzer browser extension</nuxt-link>. The
        extension automatically checks pages you visit and reveals the
        technologies the website is built with. Click on any category or
        technology for more insights, such as market share and the top websites
        using a specific CMS.
      </p>

      <p>
        Alternatively, you can use the online
        <nuxt-link to="/lookup/">technology lookup</nuxt-link>, which requires
        no installation. Results are usually instant and more in-depth
        information is displayed alongside the list of identified technologies.
        If you're performing market research for a software product, the
        technology lookup is a great way to identify potential customers.
      </p>

      <h2 class="text-h2 mt-8 mb-2">The hard way</h2>

      <p>
        Wappalyzer identifies technologies by inspecting websites' source code,
        HTTP headers, cookies, JavaScript variables and several other methods.
        Although not as straight-forward, it's possible to do this by hand.
        We'll go through a few examples below.
      </p>

      <h3 class="text-h3 mt-8 mb-2">
        Find out if a website is using WordPress
      </h3>

      <p>
        <nuxt-link to="/technologies/cms/wordpress/"> WordPress</nuxt-link>
        sites can usually be identified by looking at the website's source code.
        Out of the box, the CMS conveniently adds a meta tag explicitly
        mentioning the name and version of the CMS. All you need to do is
        right-click the page, click 'view page source' and search the HTML for
        the generator meta tag.
      </p>

      <v-card class="mt-8 mb-10">
        <v-card-text>
          <pre><Code>&lt;meta name="generator" content="WordPress 4.9.8" /&gt;</Code></pre>
        </v-card-text>
      </v-card>

      <p>
        The tag is used by other platforms as well, making it a good first thing
        to look for when trying to determine which CMS is being used.
      </p>

      <h3 class="text-h3 mt-8 mb-2">Find out if a website is using Shopify</h3>

      <p>
        <nuxt-link to="/technologies/ecommerce/shopify/">Shopify</nuxt-link> is
        a popular ecommerce solution that makes it easy to set up an online
        store. Websites using Shopify often use a shopify.io subdomain, making
        the platform easy to identify. However, professional websites will often
        use a custom domain.
      </p>

      <p>
        The easiest and most reliable method to check if a website is using
        Shopify is to check the presence of the global 'Shopify' JavaScript
        variable on the page. To do this, open the developer tools (Option + ⌘ +
        I on macOS, or Shift + CTRL + I on Windows/Linux) and type 'Shopify' in
        the console, followed by return. If Shopify is in use, you will see a
        JavaScript object in the output. If not, you will see an error saying
        'Shopify is not defined'.
      </p>

      <h3 class="text-h3 mt-8 mb-2">
        Find out what web server or CDN a website is using
      </h3>

      <p>
        Web servers and <nuxt-link to="/technologies/cdn/">CDNs</nuxt-link> can
        often be identified by inspecting HTTP headers. When you navigate to a
        web page, both the request and response include headers containing
        additional information such as content type or cookies.
      </p>

      <p>
        To see the headers of a page, open the developer tools and click on the
        'Network' tab. Now refresh the page to see all the network requests. In
        this case we only care about the very first request, which is the page
        itself. The requests that follow are to load resources such as images
        and scripts. When you click the first request, you'll see a section with
        response headers. Often there will be a header called 'server', exposing
        the name of the web server (e.g.
        <nuxt-link to="/technologies/web-servers/apache/">Apache</nuxt-link> or
        <nuxt-link to="/technologies/web-servers/nginx/">Nginx</nuxt-link>) or
        CDN (e.g.
        <nuxt-link to="/technologies/cdn/cloudflare/">CloudFlare</nuxt-link>,
        <nuxt-link to="/technologies/cdn/akamai/">Akamai</nuxt-link> or
        <nuxt-link to="/technologies/cdn/amazon-cloudfront/"
          >Amazon CloudFront</nuxt-link
        >).
      </p>

      <h2 class="text-h2 mt-8 mb-2">Conclusion</h2>

      <p>
        There are many different ways to find out what
        <nuxt-link to="/technologies/cms/">CMS</nuxt-link> or
        <nuxt-link to="/technologies/web-frameworks/">framework</nuxt-link> is
        used on a given website. By far the easiest way is to use a technology
        checker like Wappalyzer but it's possible to do it by hand.
      </p>

      <p>
        You can use the <nuxt-link to="/api/">Wappalyzer APIs</nuxt-link> to add
        technology lookups to your own project or website. Or, if you want to
        create a list of websites using a certain technology, have a look at
        Wappalyzer's <nuxt-link to="/lists/">lead lists</nuxt-link>.
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
import Code from '~/components/Code.vue'

export default {
  components: {
    Page,
    Logos,
    Code,
  },
  data() {
    return {
      title: 'Find out what CMS or framework a website is using',
      crumbs: [{ title: 'Articles', to: '/articles/' }],
      meta: `Find out what CMS or framework a website is using. The best tools and methods to identify technologies on websites.`,
    }
  },
}
</script>
