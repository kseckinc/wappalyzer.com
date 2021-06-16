<template>
  <Page :crumbs="crumbs" :title="title" :head="{ meta }" no-head narrow>
    <article>
      <h1 class="text-h1 mb-8">{{ title }}</h1>

      <p>
        Lead qualification can be a long process with many steps. Save time by
        automating research into your clients' current technical stack. So when
        a client wants your help in updating their website, you'll
        <nuxt-link
          to="/articles/find-out-what-cms-or-framework-a-website-is-using/"
          >instantly know what CMS or framework they are using</nuxt-link
        >
        without having to ask the client first. In this article, we'll explain
        how to set up an automation that sends a Slack message containing the
        technology stack used on a lead's website, when they filled out a form.
        We'll use the following tools:
      </p>

      <ul class="mb-4">
        <li>
          <strong
            ><a href="https://www.integromat.com" target="_blank" rel="noopener"
              >Integromat</a
            ></strong
          >
          to set up the workflow
        </li>
        <li>
          <strong
            ><a href="https://www.typeform.com/" target="_blank" rel="noopener"
              >Typeform</a
            ></strong
          >
          for lead capture
        </li>
        <li>
          <strong><a href="https://www.wappalyzer.com/">Wappalyzer</a></strong>
          to fetch the technology stack of your lead's website
        </li>
        <li>
          <strong
            ><a href="https://slack.com" target="_blank" rel="noopener"
              >Slack</a
            ></strong
          >
          to send your team a message whenever a new lead has filled out the
          form, containing the URL and webstack
        </li>
      </ul>

      <p>
        <em>
          You can replace Typeform or Slack with your favourite form creation or
          team communication tool like Google Forms or Basecamp.
        </em>
      </p>

      <h2 class="text-h2 mt-8 mb-2">What is Integromat?</h2>

      <p>
        Integromat is a
        <a
          href="https://www.luhhu.com/blog/a-quick-guide-to-zapier-alternatives"
          target="_blank"
          rel="noopener"
          >workflow automation tool similar to</a
        >
        the more well-known Zapier and IFTTT. The important distinctive features
        of Integromat are its competitive pricing and its advanced features.
        Integromat is very flexible when creating automations. You don't need a
        paid subscription to use this workflow. The generous free plan offers up
        to 1,000 operations per month. Enough to run this automation 200 times!
      </p>

      <h2 class="text-h2 mt-8 mb-2">What you'll be automating</h2>

      <p>When finished, your automation will consist of 4 steps:</p>

      <ol class="mb-4">
        <li>Trigger the flow whenever a new lead has submitted a Typeform</li>
        <li>
          Parse the URL the new lead has entered in the form to Wappalyzer
        </li>
        <li>
          Extract the technology stack from the information Wappalyzer sends
          back
        </li>
        <li>Send the extracted information to a Slack channel</li>
      </ol>

      <h2 class="text-h2 mt-8 mb-2">Connect Integromat to Typeform</h2>

      <p>
        Let's imagine we're a webdev agency. We have a contact form on our
        website that website visitors can use to request a quote. This Typeform
        contains questions like what service they want, their contact info, and
        a URL to their website. We'll assume you've already set up such a form,
        and that it is published. Please make sure you've used a 'Website'
        question type in Typeform.
      </p>

      <v-card class="my-8" :max-width="971 * 0.75">
        <v-img
          src="/images/articles/get-the-technology-stack-of-new-leads-in-slack/wappalyzer-integromat-9.png"
          alt=""
        />
      </v-card>

      <p>New leads are asked to fill in their website</p>

      <p>
        Create a new scenario in Integromat. Select 'Typeform' and click
        <em>Continue</em>. Select the instant version of 'Watch responses'.
      </p>

      <v-card class="my-8" :max-width="397 * 0.75">
        <v-img
          src="/images/articles/get-the-technology-stack-of-new-leads-in-slack/wappalyzer-integromat-7.png"
          alt=""
        />
      </v-card>

      <p>
        Connect Integromat to your Typeform account. Select the lead capture
        form, and leave the rest of the settings as-is.
      </p>

      <v-card class="my-8" :max-width="399 * 0.75">
        <v-img
          src="/images/articles/get-the-technology-stack-of-new-leads-in-slack/wappalyzer-integromat-2.png"
          alt=""
        />
      </v-card>

      <h2 class="text-h2 mt-8 mb-2">Connect Typeform to Wappalyzer</h2>

      <p>
        Integromat will now automatically know which URL new leads have filled
        into your form. Let's hand this information over to Wappalyzer and let
        it find out all kinds of useful things about your lead's website. Before
        you can use Wappalyzer in Integromat, you first need to create an API
        key on your Wappalyzer account. Go to account settings in Wappalyzer,
        select the <nuxt-link to="/apikey/">API Key</nuxt-link> tab and click on
        <em>Create key</em>.
      </p>

      <v-card class="my-8" :max-width="1798 * 0.75">
        <v-img
          src="/images/articles/get-the-technology-stack-of-new-leads-in-slack/wappalyzer-integromat-4.png"
          alt=""
        />
      </v-card>

      <p>
        Connect a Wappalyzer module to the Typeform module in Integromat and
        paste the API key. For 'Website URL', select 'URL' under the
        <em>Answers</em>
        toggle.
      </p>

      <v-card class="my-8" :max-width="750 * 0.75">
        <v-img
          src="/images/articles/get-the-technology-stack-of-new-leads-in-slack/wappalyzer-integromat-5.png"
          alt=""
        />
      </v-card>

      <h2 class="text-h2 mt-8 mb-2">Extract the technology stack</h2>

      <p>
        You're well on your way now: Wappalyzer will automatically gather all
        kinds of useful info on your lead's website when they fill out the form!
        Now it's time to extract which technologies your new lead is using to
        run their website. Under tools → Flow control add the Iterator module.
      </p>

      <v-card class="my-8" :max-width="348 * 0.75">
        <v-img
          src="/images/articles/get-the-technology-stack-of-new-leads-in-slack/wappalyzer-integromat-8.png"
          alt=""
        />
      </v-card>

      <p>
        For the 'Array' field, select 'Technologies'. This will enable us to get
        the name of each tool in the technology stack, no matter how many are
        being used.
      </p>

      <p>Add the 'Text aggregator' module.</p>

      <p>
        Select the Iterator from the previous step as the Source Module. For the
        text, select the <em>Name</em> property from the Iterator and then type
        in "newline". This will ensure that all the tools in the stack sent in
        your Slack message will be organized in a single neat list, instead of
        separate messages.
      </p>

      <v-card class="my-8" :max-width="639 * 0.75">
        <v-img
          src="/images/articles/get-the-technology-stack-of-new-leads-in-slack/wappalyzer-integromat-1.png"
          alt=""
        />
      </v-card>

      <h2 class="text-h2 mt-8 mb-2">Send a message to Slack</h2>

      <p>
        You've let Wappalyzer inspect your lead's website. Now it's time to send
        that information to the relevant channel in Slack. Add the Slack module
        in Integromat, connect to your Slack account and click
        <em>Create a Message</em>. Select the channel type and name for your
        message. We've already created a new channel in Slack and gave it the
        original and inspiring name 'New leads', and suggest you do something
        similar. For the text, you can use something like the following:
      </p>

      <v-card class="my-8" :max-width="442 * 0.75">
        <v-img
          src="/images/articles/get-the-technology-stack-of-new-leads-in-slack/wappalyzer-integromat-6.png"
          alt=""
        />
      </v-card>

      <p>
        Make sure to select 'URL' from the Typeform connection, and 'text' from
        the Text aggregator.
      </p>

      <p>
        When finished, test it out by typing
        <a href="https://www.luhhu.com/" target="_blank" rel="noopener"
          >luhhu.com</a
        >
        in your form and compare it to our results in Slack:
      </p>

      <v-card class="my-8" :max-width="667 * 0.75">
        <v-img
          src="/images/articles/get-the-technology-stack-of-new-leads-in-slack/wappalyzer-integromat-3.png"
          alt=""
        />
      </v-card>

      <p>
        Congratulations! You’re saving valuable time by making lead
        qualification easier and faster. Now every time a new lead fills out a
        form, your team will instantly get notified of the technology stack they
        use for their website.
      </p>

      <v-alert class="mt-12" outlined>
        This was a guest post from
        <a href="https://twitter.com/nocodeluc" target="_blank" rel="noopener"
          >Luc Meijer</a
        >
        at
        <a href="https://www.luhhu.com/" target="_blank" rel="noopener">Luhhu</a
        >. An automation agency that helps customer save time, money, and sanity
        streamlining their processes with Zapier.
      </v-alert>
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
      title: 'Get the technology stack of new leads to your Slack instantly',
      crumbs: [{ title: 'Articles', to: '/articles/' }],
      meta: `Save time by automating research into your clients' current technical stack.`,
    }
  },
}
</script>
