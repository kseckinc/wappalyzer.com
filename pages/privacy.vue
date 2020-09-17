<template>
  <div>
    <Page :title="title" :hero="false" narrow no-head no-subscribe>
      <h1 class="text-h1 mb-8">{{ title }}</h1>

      <p>
        The Wappalyzer privacy policy describes how we treat personal
        information when you use our website, software and APIs (collectively,
        '<strong>Services</strong>').
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Log data
      </h2>

      <p>
        As with most websites and technology services delivered over the
        internet, our servers automatically collect information when you access
        or use our Services and record it in log files. This log data may
        include the internet protocol (IP) address, the date and time the
        Services were used, browser type and settings and cookie data.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Account registration
      </h2>

      <p>
        When you open an account, you provide us with personal information that
        includes your email address and a password. You can also choose to add a
        billing address to your account. You can delete your information and
        cancel your account at any time.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Browser extension
      </h2>

      <p>
        You do not need to provide any personal information in order to download
        and use the browser extension.
      </p>

      <p>
        We do not track your browsing behaviour or any information that can be
        traced back to you personally.
      </p>

      <p>
        The browser extension periodically sends information about websites you
        visit to our servers. This information includes domain names, anonymised
        URLs and the names of identified technologies. This information may be
        sold to or shared with third parties. You can disable the automatic
        sending of information in the browser extension settings.
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
      title: 'Privacy policy',
    }
  },
}
</script>

<style>
h2 .privacy__anchor {
  visibility: hidden;
}

h2:hover .privacy__anchor {
  visibility: visible;
}

.privacy__anchor {
  text-decoration: none;
}
</style>
