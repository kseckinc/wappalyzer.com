<template>
  <div style="width: 100%">
    <v-card
      v-for="(set, setKey) in attributes"
      :key="setKey"
      class="mb-4 pb-4"
      outlined
    >
      <v-sheet color="secondary">
        <v-card-title
          class="subtitle-2 d-flex justify-space-between"
          style="line-height: 1rem"
        >
          {{ set.title }}

          <span class="body-2 my-n2">
            <v-chip
              v-if="['contact', 'company', 'social'].includes(setKey)"
              to="/pro/"
              color="primary"
              class="ml-2"
              x-small
              outlined
              >PRO</v-chip
            >
          </span>
        </v-card-title>
      </v-sheet>

      <Pro v-if="maskedSets.includes(setKey)" small />

      <div
        v-for="(attribute, attributeKey) in set.attributes"
        :key="attributeKey"
      >
        <v-card-title class="caption font-weight-medium pb-0">
          {{ attribute.title }}
        </v-card-title>

        <v-card-text class="pb-0">
          <template
            v-if="
              ['email', 'verifiedEmail', 'safeEmail', 'phone'].includes(
                attributeKey
              ) || setKey === 'social'
            "
          >
            <span v-for="(value, index) in attribute.values" :key="index">
              <nuxt-link
                v-if="
                  ['email', 'verifiedEmail', 'safeEmail'].includes(attributeKey)
                "
                :to="
                  maskedSets.includes(setKey)
                    ? '/pro/'
                    : `/verify/${value.text}`
                "
                color="accent--text"
                class="mr-2"
                outlined
                label
              >
                <v-icon color="accent" class="mr-1" small>{{ mdiEmail }}</v-icon
                ><small :class="maskedSets.includes(setKey) ? 'blurred' : ''">{{
                  value.text
                }}</small>
              </nuxt-link>
              <nuxt-link
                v-else-if="attributeKey === 'phone'"
                :href="
                  maskedSets.includes(setKey) ? undefined : `tel:${value.text}`
                "
                :to="maskedSets.includes(setKey) ? '/pro/' : ''"
                color="accent--text"
                class="mr-2"
                outlined
                label
              >
                <v-icon color="accent" class="mr-1" small>{{ mdiPhone }}</v-icon
                ><small :class="maskedSets.includes(setKey) ? 'blurred' : ''">{{
                  value.text
                }}</small>
              </nuxt-link>
              <nuxt-link
                v-else-if="value.to"
                :href="maskedSets.includes(setKey) ? undefined : value.to"
                :to="maskedSets.includes(setKey) ? '/pro/' : ''"
                rel="nofollow noopener"
                target="_blank"
                color="accent--text"
                class="mr-2"
                outlined
                label
              >
                <v-icon
                  v-if="
                    [
                      'twitter',
                      'instagram',
                      'facebook',
                      'linkedin',
                      'youtube',
                      'github',
                      'pinterest',
                    ].includes(attributeKey)
                  "
                  color="accent"
                  class="mr-1"
                  small
                >
                  {{ mdi[attributeKey] }} </v-icon
                ><small :class="maskedSets.includes(setKey) ? 'blurred' : ''">{{
                  value.text
                }}</small>
              </nuxt-link>
            </span>
          </template>

          <template v-else>
            <div v-for="(value, index) in attribute.values" :key="index">
              <v-icon v-if="value.text === true" color="success" small>
                {{ mdiCheck }}
              </v-icon>
              <v-icon v-else-if="value.text === false" color="error" small>
                {{ mdiClose }}
              </v-icon>
              <div
                v-else-if="attributeKey === 'employees'"
                :class="`${maskedSets.includes(setKey) ? 'blurred ' : ''}`"
              >
                <v-divider v-if="index" class="my-2" />

                <small>{{ value.text.split(' -- ').shift() }}</small>
                <small v-if="value.text.split(' -- ').pop().length >= 3"
                  >&mdash; {{ value.text.split(' -- ').pop() }}</small
                >
              </div>
              <small
                v-else-if="attributeKey === 'certInfo.validTo'"
                :class="`${maskedSets.includes(setKey) ? 'blurred ' : ''}`"
              >
                {{ formatDate(new Date(value.text * 1000)) }}
              </small>
              <small
                v-else
                :class="`${
                  maskedSets.includes(setKey) && setKey === 'company'
                    ? 'blurred '
                    : ''
                }`"
              >
                {{
                  !expanded[attributeKey] && value.text.length > 250
                    ? `${value.text.slice(0, 250)}...`
                    : value.text
                }}

                <a
                  v-if="value.text.length > 250"
                  href="#"
                  @click.prevent="toggle(attributeKey)"
                  >Show {{ expanded[attributeKey] ? 'less' : 'more' }}</a
                >
              </small>
            </div>
          </template>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
import {
  mdiCheck,
  mdiClose,
  mdiTwitter,
  mdiFacebook,
  mdiInstagram,
  mdiLinkedin,
  mdiPhone,
  mdiEmail,
  mdiYoutube,
  mdiGithub,
  mdiPinterest,
} from '@mdi/js'

import Pro from '~/components/Pro.vue'

export default {
  components: {
    Pro,
  },
  props: {
    hostname: {
      type: Object,
      default() {
        return {}
      },
    },
    maskedSets: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      mdiCheck,
      mdiClose,
      mdiPhone,
      mdiEmail,
      mdi: {
        twitter: mdiTwitter,
        facebook: mdiFacebook,
        instagram: mdiInstagram,
        linkedin: mdiLinkedin,
        youtube: mdiYoutube,
        github: mdiGithub,
        pinterest: mdiPinterest,
      },
      expanded: {},
    }
  },
  computed: {
    attributes() {
      const hostname = Object.keys(this.hostname).reduce((hostname, key) => ({
        ...hostname,
        ...([
          'verifiedEmail',
          'safeEmail',
          'copyrightYear',
          'responsive',
          'schemaOrgTypes',
        ].includes(key)
          ? {}
          : {
              [key]: this.hostname[key],
            }),
      }))

      return this.transformAttributes(
        [
          'contact',
          'company',
          'social',
          'meta',
          'locale',
          'trackers',
          'security',
        ],
        hostname
      )
    },
  },
  methods: {
    toggle(attributeKey) {
      if (this.expanded[attributeKey]) {
        delete this.expanded[attributeKey]

        this.expanded = { ...this.expanded }
      } else {
        this.expanded = {
          ...this.expanded,
          [attributeKey]: true,
        }
      }
    },
  },
}
</script>

<style>
.nopadding .v-expansion-panel-content__wrap {
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
}

.blurred {
  filter: blur(3px);
  opacity: 0.5;
}
</style>
