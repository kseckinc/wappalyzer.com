<template>
  <v-container class="matrix__container pl-0 pr-3 pt-2 pb-4">
    <v-row class="matrix" no-gutters>
      <v-col>
        <v-responsive
          :height="
            (Object.values(items).some(({ price }) => price) ? 0 : 10) + 225
          "
        />
        <div v-for="attr in attrs" :key="attr.text">
          <v-divider />
          <v-responsive height="60" class="align-center">
            <v-card-text class="py-0">
              {{ attr.text }}
            </v-card-text>
          </v-responsive>
        </div>
      </v-col>
      <v-col
        v-for="(item, id) in items"
        :key="item.size"
        :class="item.raised ? 'matrix__col--raised' : ''"
      >
        <v-responsive v-if="!item.raised" height="20"> </v-responsive>
        <v-card
          :raised="item.raised"
          class="text-center"
          :style="`${
            item.raised ? 'border: 1px solid #4608ad; margin-top: -1px' : ''
          }`"
        >
          <v-responsive v-if="!item.raised" height="20"> </v-responsive>
          <v-responsive
            v-if="item.raised && Object.keys(items).length > 1"
            height="40"
          >
            <v-card-subtitle class="overline pa-0">
              <v-sheet color="primary lighten-1 primary--text">
                <small>
                  {{ raisedText }}
                </small>
              </v-sheet>
            </v-card-subtitle>
          </v-responsive>
          <v-responsive height="50">
            <v-card-title class="justify-center py-2">
              {{ item.name }}
            </v-card-title>
          </v-responsive>
          <v-responsive
            v-if="Object.values(items).some(({ price }) => price)"
            height="60"
            class="align-center"
          >
            <v-card-text class="py-0 justify-center">
              <template v-if="item.enterprise">
                <small class="text--disabled">
                  Tailored plans available
                </small>
              </template>
              <template v-if="item.price === 0">
                <span class="font-weight-medium">
                  Free forever
                </span>
                <div class="text--disabled">
                  <small>No credit card required</small>
                </div>
              </template>
              <template v-else-if="item.price">
                <span class="font-weight-medium">
                  {{ formatCurrency(item.price / 100) }}
                </span>
                <span> / {{ item.interval }} </span>
                <div>
                  <small><AudToUsd :aud="item.price" /></small>
                </div>
              </template>
            </v-card-text>
          </v-responsive>
          <v-responsive
            v-if="item.description"
            height="70"
            class="align-center"
          >
            <v-card-subtitle>
              {{ item.description }}
              <span v-if="item.readMore"
                ><nuxt-link :to="item.readMore">Read more</nuxt-link>.</span
              >
            </v-card-subtitle>
          </v-responsive>
          <v-responsive height="75">
            <v-card-actions>
              <v-btn
                v-if="item.buttonAction === 'signUp'"
                :disabled="isSignedIn"
                color="primary"
                class="mx-auto"
                text
                @click="signInDialog = true"
                >Sign up</v-btn
              >
              <v-btn
                v-else-if="item.to || item.enterprise"
                :to="item.enterprise ? '/contact' : item.to"
                :text="!item.raised"
                color="primary white-text"
                class="mx-auto"
                >{{ item.enterprise ? 'Contact us' : buttonText }}</v-btn
              >
              <v-btn
                v-else
                :text="!item.raised"
                color="primary white-text"
                class="mx-auto"
                @click="$emit('select', id)"
                >{{ buttonText }}</v-btn
              >
            </v-card-actions>
          </v-responsive>
          <div v-for="(attr, name) in attrs" :key="name">
            <v-divider />
            <v-responsive height="60">
              <v-card-text class="text-center">
                <template v-if="attr.type === 'currency'">
                  <template v-if="item.attrs[name] === 0">
                    <span class="font-weight-medium">
                      Free
                    </span>
                  </template>
                  <template v-else-if="typeof item.attrs[name] === 'string'">
                    {{ item.attrs[name] }}
                  </template>
                  <template v-else>
                    <span class="font-weight-medium">
                      {{ formatCurrency(item.attrs[name] / 100) }}
                    </span>
                  </template>
                </template>
                <template
                  v-else-if="attr.type === 'number' || attr.type === 'credits'"
                >
                  <template v-if="item.attrs[name]">
                    <template v-if="typeof item.attrs[name] === 'string'">
                      {{ item.attrs[name] }}
                    </template>
                    <template v-else>
                      {{ formatNumber(item.attrs[name]) }}
                      <span class="caption text--disabled"
                        >({{
                          formatCurrency(
                            Math.floor(creditsToCents(item.attrs[name]) / 100)
                          ).replace(' AUD', '')
                        }}
                        value)</span
                      >
                    </template>
                  </template>
                </template>
                <template v-else-if="attr.type === 'boolean'">
                  <v-icon v-if="item.attrs[name] === true" color="success">
                    mdi-check
                  </v-icon>
                  <v-icon v-else-if="item.attrs[name] === false">
                    &nbsp;
                  </v-icon>
                  <small v-else>
                    {{ item.attrs[name] }}
                  </small>
                </template>
                <small v-else-if="attr.type === 'small'">
                  {{ item.attrs[name] }}
                </small>
                <template v-else>
                  {{ item.attrs[name] }}
                </template>
              </v-card-text>
            </v-responsive>
          </div>
          <v-responsive v-if="item.raised" height="20"> </v-responsive>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-sign-up no-banner />
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

import SignIn from '~/components/SignIn.vue'
import AudToUsd from '~/components/AudToUsd.vue'

export default {
  components: {
    SignIn,
    AudToUsd,
  },
  props: {
    items: {
      type: Object,
      default: () => {},
    },
    attrs: {
      type: Object,
      default: () => {},
    },
    buttonText: {
      type: String,
      default: 'Order',
    },
    raisedText: {
      type: String,
      default: 'Most popular',
    },
  },
  data() {
    return {
      signInDialog: false,
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
    }),
  },
  watch: {
    '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn && this.signInDialog) {
        this.signInDialog = false
      }
    },
  },
}
</script>

<style>
.matrix {
  min-width: 850px;
}

.matrix__container {
  overflow-x: auto;
}

.matrix__col--raised {
  z-index: 2;
}
</style>
