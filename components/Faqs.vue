<template>
  <div>
    <v-expansion-panels v-if="topic === 'lists'">
      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          What are lead lists?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Our <nuxt-link to="/lists/">lead lists</nuxt-link> are lists of
            websites that use a certain
            <nuxt-link to="/technologies/">web technologies</nuxt-link>, along
            with email addresses and phone numbers. Lead lists help sales and
            marketing teams with prospecting, market research and competitor
            analysis.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          What information is included in the lists?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Lead lists include domain names, version numbers, website country
            and language, a traffic indicator, email addresses, phone numbers
            and links to social media profiles such as LinkedIn, subject to
            availability.
          </p>

          <p>
            See the full list of
            <nuxt-link to="/docs/sets/">attributes</nuxt-link> and
            <a href="/list-sample.zip">lead list sample</a>.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          What segmentation options are available?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Lead lists can be filtered by IP country, top-level domain and
            language. Right now we do not segment by company information such as
            size, revenu or industry.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          The technology I'm looking for is not in the list, can it be added?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            If a web technology is unavaible, please
            <nuxt-link to="/contact/">contact us</nuxt-link> and we may be able
            to add it in. You can help us providing examples of websites that
            use it and/or code snippets unique to the technology. Once a
            technology has been added, it can take a few weeks for a meaningful
            amount of data to be collected.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          What is IP country?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            IP country is the country a website's IP address belongs to.
            Typically this is where the website is hosted, which can be
            indicative of the location the business that owns the website
            operates from.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          How is the information being collected?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            We collect limited information through our
            <nuxt-link to="/download/">browser extension</nuxt-link>
            in accordance with our
            <nuxt-link to="/privacy/">privacy policy</nuxt-link> and perform
            in-depth analysis using in-house crawlers. Our unique methods ensure
            only actively visited websites are included in the lists, including
            pages that traditional crawlers can't reach.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          How accurate is the data?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Out technology data is of a very high standard and corroborated
            across multiple sources. Email addresses and phone numbers obtain
            from websites' contact pages are unverified and as-is.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          How fresh is the data?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            The data is being updated and added to every day. By default, data
            in the lead lists can be up to three months old but this can be
            lowered down to one month.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          How do you determine website traffic?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Website traffic is tracked using our
            <nuxt-link to="/download/">browser extensions</nuxt-link> with 1.5M
            users. The install base provides a large enough sample set to
            determine which websites receive more traffic than others, resulting
            in a relative traffic indicator.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          Can I use a different payment method?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Please <nuxt-link to="/contact/">contact us</nuxt-link> if you wish
            to pay via bank transfer or Bitcoin, or discuss options.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          What is your refund policy?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            If you're not satisfied with the quality of a list for any reason,
            we'll work with you to resolve the problem or issue a refund. Please
            refer to the <nuxt-link to="/terms/">terms of use</nuxt-link>.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-expansion-panels v-if="topic === 'api'">
      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          What information is included in API responses?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            The APIs return domain names, version numbers, website country and
            language, a traffic indicator, email addresses, phone numbers and
            links to social media profiles such as LinkedIn, subject to
            availability.
          </p>

          <p>
            See the full list of
            <nuxt-link to="/docs/sets/">attributes</nuxt-link>.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          How is the information being collected?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            We collect limited information through our
            <nuxt-link to="/download/">browser extension</nuxt-link>
            in accordance with our
            <nuxt-link to="/privacy/">privacy policy</nuxt-link> and perform
            in-depth analysis using in-house crawlers. Our unique methods ensure
            only actively visited websites are included in the lists, including
            pages that traditional crawlers can't reach.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          How fresh is the data?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            The data is being updated and added to every day. By default, lookup
            results can be up to three months old but this can be lowered down
            to one month. Crawl results are real-time.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          How do you determine website traffic?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Website traffic is tracked using our
            <nuxt-link to="/download/">browser extensions</nuxt-link> with 1.5M
            users. The install base provides a large enough sample set to
            determine which websites receive more traffic than others, resulting
            in a relative traffic indicator.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          Do you offer a free trial?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Sign up for <nuxt-link to="/pricing/">free plan</nuxt-link> to get
            50 credits every month to use with the APIs and other products.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-expansion-panels v-if="topic === 'credits'">
      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          What are credits?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Credits can be spent on a range of products, including lead lists
            and APIs. Each product has a fixed spend per unit, detailed on the
            <nuxt-link to="/pricing/">pricing</nuxt-link> page.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          When do credits expire?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Credits included in plans expire after 60 days. Credits purchased
            directly expire after 365 days. Expired credits can no longer be
            used.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          Can I use a different payment method?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Plans can only be purchased with a credit card. Credits and other
            products can be purchased directly using a credit card or PayPal
            account. Please
            <nuxt-link to="/contact/">contact us</nuxt-link> if you wish to pay
            via bank transfer or Bitcoin, or discuss options.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          What is your refund policy?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Credits are generally non-refundable. However, if you're
            dissatisfied with the quality of our offering we will either work
            with you to resolve the issue, credit your account or issue a
            pro-rata refund. Please refer to the
            <nuxt-link to="/terms/">terms of use</nuxt-link>.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-expansion-panels v-if="topic === 'extension'">
      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          Can I suggest a technology to be added?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            The browser extension is open-source. If you are a developer or have
            access to one, please refer to our
            <a
              href="https://github.com/AliasIO/wappalyzer/blob/master/CONTRIBUTING.md"
              rel="noopener"
              target="_blank"
              >contributing guide</a
            >. Otherwise, please
            <a
              href="https://github.com/AliasIO/wappalyzer/issues/new/choose"
              rel="noopener"
              target="_blank"
              >create an issue</a
            >
            on GitHub.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          Where can I report a bug or request a new feature?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Please
            <a
              href="https://github.com/AliasIO/wappalyzer/issues/new/choose"
              rel="noopener"
              target="_blank"
              >create an issue</a
            >
            on GitHub.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          How does the extension work?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            The extension inspects HTML, scripts, cookies and network requests
            and certificates of pages you visit, looking for unique technology
            fingerprints.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          Can I hide technologies on my website from Wappalyzer?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            Although in many cases it's possible to change a software
            application's output to obfuscate its charactaristics, it's often
            impractical and unnecessary. If you're worried about security,
            ensure your software is always up-to-date. For more information, see
            <nuxt-link to="/articles/how-to-hide-technologies-from-wappalyzer/"
              >How to hide technologies from Wappalyzer</nuxt-link
            >.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header class="subtitle-2">
          What information do you collect?
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            We collect information in accordance with our
            <nuxt-link to="/privacy/">privacy policy</nuxt-link>. By default,
            when you visit a website, we record the domain name and identified
            technologies in a way that can't be traced back to you. You can
            disable this behaviour in the extension's settings.
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  props: {
    topic: {
      type: String,
      default: 'lists',
    },
  },
}
</script>
