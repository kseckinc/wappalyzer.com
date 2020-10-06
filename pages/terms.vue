<template>
  <div>
    <Page :title="title" :hero="false" narrow no-head no-subscribe>
      <h1 class="text-h1 mb-8">{{ title }}</h1>

      <p>
        These Wappalyzer terms of service (the '<strong>Terms</strong>')
        describe your rights and responsibilities when using our website,
        software and APIs (collectively, '<strong>Services</strong>').
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Privacy
      </h2>

      <p>
        You consent to Wappalyzer's
        <nuxt-link to="/privacy/">privacy policy</nuxt-link>, which explains how
        we collect and use the information you provide to us.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Prohibitions on content
      </h2>

      <p>
        You must not reproduce, duplicate, copy, sell, resell, or otherwise
        exploit our website or material on our website for a commercial purpose,
        without our consent.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Account registration
      </h2>

      <p>
        When you open an account we will ask you for information, which may
        include your name and other personal information. You must provide
        accurate and complete information in response to our questions, and you
        must keep that information current. You are fully responsible for all
        activity that occurs under your account, including for any actions taken
        by persons to whom you have granted access to the account. We reserve
        the right to suspend or terminate the account.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Using our data services
      </h2>

      <h3 class="text-h3 mb-2">
        Permitted access
      </h3>

      <p>
        You will only access (or attempt to access) an API by the means
        described in the documentation of that API.
      </p>

      <h3 class="text-h3 mb-2">
        API limitations
      </h3>

      <p>
        Wappalyzer sets and enforces limits on your use of the APIs (e.g.
        limiting the number of API requests that you may make or the number of
        users you may serve), in our sole discretion. You agree to, and will not
        attempt to circumvent, such limitations documented with each API.
      </p>

      <h3 class="text-h3 mb-2">
        Restrictions
      </h3>

      <p>
        The data provided to you as part of our commercial Services is licensed,
        not sold. You may not sublicense, resell or share the data without
        explicit permission in writing from Wappalyzer.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Payment for services
      </h2>

      <p>
        Wappalyzer may offer Services to be paid for on a recurring basis or on
        an one-off basis. Subscriptions may subject you to recurring fees. You
        may cancel your subscription at any time. You accept that you if you no
        longer require the service it is your responsibility to cancel your
        subscription. Cancellation functions are available via your Wappalyzer
        account.
      </p>

      <h3 class="text-h3 mb-2">
        Refunds
      </h3>

      <p>
        You cannot get a refund if you change your mind. Your rights for payment
        of services are protected under Australian consumer law if your purchase
        is faulty or doesn't provide what is promised.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Publicity
      </h2>

      <p>
        You grant us the right to use your company name and logo as a reference
        for marketing or promotional purposes on our website and in other public
        or private communications with our existing or potential developers and
        customers, subject to your standard trademark usage guidelines.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Disclaimer of warranties
      </h2>

      <p>
        Our Services are provided on an 'as is' and 'as available' basis without
        warranties of any kind. You acknowledge that we do not warrant that the
        Services will be uninterrupted, timely, secure or error-free.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Limitation of liability
      </h2>

      <p>
        In no event will we have any liability to you or to any third party for
        any lost profits or revenues or for any damages however caused.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Modification and termination
      </h2>

      <p>
        We may amend the Terms and the documentation accompanying the applicable
        Wappalyzer APIs at any time. We may provide notice by posting the
        relevant revised Terms on our website or alert you via email. The
        revised Terms will be effective as of the time it is posted, but will
        not apply retrospectively. Your continued use of the Services after
        notice of the revised Terms becomes effective constitutes your
        acceptance of the revised Terms.
      </p>

      <p>
        You may terminate the Terms by cancelling your account and ceasing all
        use of the Services.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Law and jurisdiction
      </h2>

      <p>
        The Terms will be governed by and construed in accordance with
        Australian law, and any disputes relating to this notice shall be
        subject to the exclusive jurisdiction of the courts of Australia.
      </p>
    </Page>
  </div>
</template>

<script>
import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Terms of service',
    }
  },
}
</script>

<style>
h2 .terms__anchor,
h3 .terms__anchor {
  visibility: hidden;
}

h2:hover .terms__anchor,
h3:hover .terms__anchor {
  visibility: visible;
}

.terms__anchor {
  text-decoration: none;
}
</style>
