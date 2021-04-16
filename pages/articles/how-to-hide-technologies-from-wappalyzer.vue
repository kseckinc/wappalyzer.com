<template>
  <Page :crumbs="crumbs" :title="title" :head="{ meta }" no-head narrow>
    <article>
      <h1 class="text-h1 mb-8">{{ title }}</h1>

      <p>
        Most web technologies, including server-side software such as CMSs,
        leave trails of evidence of their presence in websites' HTML code. This
        code is publicly accessible, which is necessary for browsers to render
        and display the page. Wappalyzer is known to be very proficient exposing
        these technologies through various fingerprinting methods.
      </p>

      <h2 class="text-h2 mt-8 mb-2">Keeping your website secure</h2>

      <p>
        It may seem concerning that information about your website's technology
        stack is exposed. After all, hackers often target platforms with known
        vulnerabilities all the time. However, simply knowing what software is
        in use is not enough to hack a website: there has to be a known,
        unpatched vulnerability to exploit.
      </p>

      <p>
        It's crucially important to keep your software up-to-date. Well-known
        CMSs and frameworks are usually actively maintained by a company or
        community of skilled developers who fix security issues regularly. No
        software is perfectly secure and a level of maintenance will always be
        required.
      </p>

      <p>
        Relying on secrecy as the main method of security is a practice widely
        rejected by security experts. However, a level of obscurity can help
        deter malicious hackers.
      </p>

      <h2 class="text-h2 mt-8 mb-2">Hiding server-side technologies</h2>

      <p>
        Application security, at least in this context, mainly applies to
        server-side technologies as this is where database interactions and
        business processes happen. They're also easier to hide. Obscuring
        client-side libraries is a futile effort in almost all cases as the
        source code has to be sent to the browser to interpret and will always
        be discoverable.
      </p>

      <p>
        To hide a technology from Wappalyzer, it helps to first understand how
        it works and what Wappalyzer looks for. Luckily, Wappalyzer is
        open-source and its library of fingerprints is publicly viewable. Refer
        to the <nuxt-link to="/docs/">documentation</nuxt-link> for more
        information.
      </p>

      <p>We'll go through a few examples below.</p>

      <h3 class="text-h3 mt-8 mb-2">Hide PHP from Wappalyzer</h3>

      <p>
        PHP can be identified by looking for the <code>.php</code> file
        extension in URLs the default <code>PHPSESSID</code> cookie. Rewriting
        URLs and changing the name of the cookie can make PHP harder to detect.
      </p>

      <p>
        <a
          href="https://www.php.net/manual/en/session.configuration.php#ini.session.name"
          target="blank"
          >php.net/manual/en/session.configuration.php#ini.session.name</a
        >
      </p>

      <h3 class="text-h3 mt-8 mb-2">Hide Laravel from Wappalyzer</h3>

      <p>
        The Laravel PHP framework can also be identified by inspecting a
        websites' cookies. It's possible to change the default cookie name to
        prevent this.
      </p>

      <p>
        <a href="https://laravel.com/docs/session" target="blank"
          >laravel.com/docs/session</a
        >
      </p>

      <h3 class="text-h3 mt-8 mb-2">
        Hide Apache or Nginx version number from Wappalyzer
      </h3>

      <p>
        The Apache and Nginx web servers can be identified by looking for the
        <code>Server</code> response header when requesting a web page. By
        default this includes the version number. To avoid this, you can disable
        server tokens in the configuration file.
      </p>

      <p>
        <a
          href="https://nginx.org/en/docs/http/ngx_http_core_module.html#server_tokens"
          target="blank"
          >nginx.org/en/docs/http/ngx_http_core_module.html#server_tokens</a
        >
        <br />

        <a
          href="https://httpd.apache.org/docs/current/mod/core.html#servertokens"
          target="blank"
          >httpd.apache.org/docs/current/mod/core.html#servertokens</a
        >
      </p>

      <h2 class="text-h2 mt-8 mb-2">Conclusion</h2>

      <p>
        The information exposed by Wappalyzer is already public to anyone and
        hiding it does not make your website secure. In most cases hiding a
        technology's characteristics ranges from impractical to impossible but
        as long as your software is up-to-date, it's not something to worry
        about.
      </p>

      <p>
        Install the free
        <nuxt-link to="/apps/">browser extension</nuxt-link> to see technologies
        used on websites you visit at glance.
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
      title: 'How to hide technologies from Wappalyzer',
      crumbs: [{ title: 'Articles', to: '/articles/' }],
      meta: `Concerned about your website's security or competitors inspecting your technology stack? Find out how to hide technologies from Wappalyzer.`,
    }
  },
}
</script>
