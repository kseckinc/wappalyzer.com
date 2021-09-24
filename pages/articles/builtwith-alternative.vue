<template>
  <Page :crumbs="crumbs" :title="title" :head="{ meta }" no-head>
    <article>
      <v-row justify="center" no-gutters>
        <v-col sm="10" lg="8">
          <h1 class="text-h1 mb-8">
            {{ title }}
          </h1>

          <h2 class="text-h2 mt-8 mb-2" />

          <v-card color="primary lighten-1" class="mb-8" flat>
            <v-card-text class="primary--text">
              Looking for a BuiltWith alternative? Wappalyzer is cheaper and
              more accurate.
            </v-card-text>
          </v-card>

          <p>
            Wappalyzer and BuiltWith are technology profilers that provide tools
            for lead generation, market research and business intelligence. The
            two companies share common background: both are Australian-based and
            founded at around the same time (2007-2008).
          </p>

          <p>
            The commonalities don't end there. With either provider, you can:
          </p>

          <ul class="mb-4">
            <li>
              <nuxt-link to="/lookup/"> Uncover </nuxt-link> the technologies
              that power any given website.
            </li>
            <li>
              <nuxt-link to="/lists/"> Create </nuxt-link> lists of websites and
              contacts that use certain technologies.
            </li>
            <li>
              <nuxt-link to="/technologies/"> Deep-dive </nuxt-link> into
              technology trends market shares.
            </li>
            <li>
              <nuxt-link to="/lookup/#bulk"> Enrich </nuxt-link> your own data
              with technology information.
            </li>
            <li>
              <nuxt-link to="/alerts/"> Monitor </nuxt-link> your competition's
              technology stacks.
            </li>
          </ul>

          <p>
            There are of course differences, some of which we'll highlight here.
          </p>

          <h2 class="text-h2 mt-8 mb-2">Feature comparison</h2>

          <v-card>
            <v-card-text class="px-0">
              <v-simple-table>
                <tbody>
                  <tr>
                    <th />
                    <th class="text-center">
                      <LogoWappalyzer style="height: 40px; width: auto" />
                    </th>
                    <th class="text-center">
                      <LogoBuiltWith
                        style="height: 25px; width: auto; margin-bottom: 10px"
                      />
                    </th>
                  </tr>
                  <tr>
                    <th>Website, company and contact lists</th>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                  </tr>
                  <tr>
                    <th>Advanced filtering by keywords, traffic, industry</th>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                  </tr>
                  <tr>
                    <th>Data enrichment</th>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                  </tr>
                  <tr>
                    <th>API access</th>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                  </tr>
                  <tr>
                    <th>CRM integrations</th>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                  </tr>
                  <tr>
                    <th>Browser extension</th>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                  </tr>
                  <tr>
                    <th>Full dataset reverified monthly</th>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon color="error">
                        {{ mdiClose }}
                      </v-icon>
                    </td>
                  </tr>
                  <tr>
                    <th>Technology versions</th>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon color="error">
                        {{ mdiClose }}
                      </v-icon>
                    </td>
                  </tr>
                  <tr>
                    <th>Organic traffic (people, not crawlers)</th>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon color="error">
                        {{ mdiClose }}
                      </v-icon>
                    </td>
                  </tr>
                  <tr>
                    <th>Crowd-sourced technology fingerprints</th>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon color="error">
                        {{ mdiClose }}
                      </v-icon>
                    </td>
                  </tr>
                  <tr>
                    <th>One-time payments accepted</th>
                    <td class="text-center">
                      <v-icon color="success">
                        {{ mdiCheck }}
                      </v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon color="error">
                        {{ mdiClose }}
                      </v-icon>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>

          <h3 class="text-h3 mt-8 mb-2">Data accuracy</h3>

          <p>
            Consistent customer feedback confirms that Wappalyzer is the most
            accurate technology profiler. Wappalyzer's data is updated daily,
            ensuring only actively visited websites are included in technology
            lookups and lead lists. The focus is on quality, not quantity.
          </p>

          <p>
            Every website tracked by Wappalyzer is reverified at least once a
            month. BuiltWith apears to do this roughly once a quarter, often
            including stale data in reports.
          </p>

          <p>
            Thanks to an active community of developers, Wappalyzer's
            crowd-sourced technology fingerprints are constantly reviewed and
            improved and technologies are added daily.
          </p>

          <h3 class="text-h3 mt-8 mb-2">Methodology</h3>

          <p>
            Wappalyzer's data is largely sourced from a
            <nuxt-link to="/apps/"> browser extension </nuxt-link>, supplemented
            by in-house crawlers. The browser extension is used by 1.5M users on
            a daily basis (ten times more than BuiltWith), providing a large
            sample size to measure website traffic and track live websites. This
            method allows scanning of pages that crawlers typically can't reach,
            such as shopping carts, checkouts and sections behind a login.
          </p>

          <h2 class="text-h2 mt-8 mb-2">BuiltWith pricing</h2>

          <p>
            BuiltWith charges a high, fixed monthly price, starting at $295 for
            the Basic plan, limiting access to only two technologies. To unlock
            all features you have to sign up for the $495 Pro plan, or the $995
            Team plan if you require more than one login.
          </p>

          <div class="mx-md-n15 mx-sm-n10 mx-n8">
            <v-img
              src="/images/articles/wappalyzer-vs-builtwith/builtwith-pricing.png"
              alt="BuiltWith pricing"
              class="mb-n10"
            />
          </div>

          <h2 class="text-h2 mt-8 mb-2">Wappalyzer pricing</h2>

          <p>
            Wappalyzer has two pricing models: one-time payments and
            subscriptions. You can buy lists and credits on a free plan, or you
            can subscribe to get credits at a lower price. Credits can be spent
            on any product, including lists and APIs, giving you the most
            flexibility.
          </p>

          <p class="mb-8">
            Wappalyzer's $99 Starter plan is fully featured. Its mid-tier plan
            is cheaper than BuiltWith's entry-tier plan and includes multiple
            logins. Discounted plans are available for startups, students and
            nonprofits.
          </p>
        </v-col>
      </v-row>

      <Pricing />

      <v-row justify="center" no-gutters>
        <v-col sm="10" lg="8">
          <h2 class="text-h2 mt-8 mb-2">Conclusion</h2>

          <p>
            Wappalyzer has been an expert in the
            <nuxt-link to="/articles/what-is-technographics/">
              technographics
            </nuxt-link>
            field for more than a decade. Its mission is to do one thing, and do
            it well. If you're not satisfied with the quality of the data, we'll
            either work with you to resolve it or issue a refund.
          </p>

          <h2 class="text-h2 mt-8 mb-2">Book a demo</h2>

          <p>
            Still not convinced?
            <nuxt-link to="/contact/"> Contact us </nuxt-link> for a demo.
          </p>
        </v-col>
      </v-row>
    </article>

    <template #footer>
      <Logos apps use-cases />
    </template>
  </Page>
</template>

<script>
import { mdiCheck, mdiClose } from '@mdi/js'

import Page from '~/components/Page.vue'
import Pricing from '~/components/Pricing.vue'
import Logos from '~/components/Logos.vue'
import LogoWappalyzer from '~/assets/images/logo/light.svg?inline'
import LogoBuiltWith from '~/assets/images/articles/wappalyzer-vs-builtwith/builtwith.svg?inline'

export default {
  components: {
    Page,
    Pricing,
    Logos,
    LogoWappalyzer,
    LogoBuiltWith,
  },
  data() {
    return {
      title: 'BuiltWith alternative',
      crumbs: [{ title: 'Articles', to: '/articles/' }],
      meta: "Looking for a BuiltWith alternative? Wappalyzer is cheaper and more accurate. Here's a full review.",
      mdiCheck,
      mdiClose,
    }
  },
}
</script>
