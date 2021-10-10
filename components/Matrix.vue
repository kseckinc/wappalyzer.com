<template>
  <v-container class="matrix__container pl-0 pr-3 pt-2 pb-4">
    <v-row
      class="matrix"
      :style="`min-width: ${200 + Object.keys(items).length * 200}px`"
      no-gutters
    >
      <v-col>
        <v-responsive
          :height="
            (Object.values(items).some(({ price }) => price) ? 0 : 20) +
            (Object.keys(items).length > 1 ? 215 : 195)
          "
        />
        <div v-for="attr in attrs" :key="attr.text">
          <v-divider />
          <v-responsive height="60" class="align-center">
            <v-card-text class="py-0">
              {{ attr.text }}

              <v-tooltip v-if="attr.description" max-width="450" right>
                <template #activator="{ on }">
                  <sup>
                    <v-icon small v-on="on">{{ mdiHelpCircleOutline }}</v-icon>
                  </sup>
                </template>

                <div v-for="(line, index) in attr.description" :key="index">
                  <br v-if="!line" />

                  {{ line }}
                </div>
              </v-tooltip>
            </v-card-text>
          </v-responsive>
        </div>
      </v-col>
      <v-col
        v-for="(item, id) in items"
        :key="item.size"
        :class="item.raised ? 'matrix__col--raised' : ''"
      >
        <v-responsive v-if="!item.raised" height="20" />
        <v-card
          :raised="item.raised"
          class="text-center"
          :style="`${
            item.raised ? 'border: 1px solid #4608ad; margin-top: -1px' : ''
          }`"
        >
          <v-responsive
            v-if="!item.raised || Object.keys(items).length === 1"
            height="20"
          />
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
            height="50"
            class="align-center"
          >
            <v-card-text class="py-0 justify-center">
              <span class="font-weight-regular text-h6">
                {{ formatCurrency(item.price / 100) }}
              </span>
              <span class="caption">
                / {{ item.interval === 'year' ? 'yr' : 'mo' }}
              </span>
            </v-card-text>
          </v-responsive>
          <v-responsive
            v-if="item.description"
            height="70"
            class="align-center"
          >
            <v-card-subtitle>
              {{ item.description }}
            </v-card-subtitle>
          </v-responsive>
          <v-responsive height="75">
            <v-card-actions>
              <v-btn
                v-if="item.buttonAction === 'signUp'"
                :disabled="isSignedIn"
                color="primary"
                class="mx-auto px-4"
                text
                @click="signInDialog = true"
              >
                Sign up
              </v-btn>
              <v-btn
                v-else-if="item.to"
                :to="item.to"
                :text="!item.raised"
                color="primary white-text"
                class="mx-auto px-4"
                depressed
              >
                {{ buttonText }}
              </v-btn>
              <v-btn
                v-else
                :text="!item.raised"
                :loading="item.buttonLoading"
                color="primary white-text"
                class="mx-auto px-4"
                depressed
                @click="$emit('select', id)"
              >
                {{ buttonText }}
              </v-btn>
            </v-card-actions>
          </v-responsive>
          <div v-for="(attr, name) in attrs" :key="name">
            <v-divider />
            <v-responsive height="60">
              <v-card-text class="text-center">
                <template v-if="attr.type === 'currency'">
                  <template v-if="item.attrs[name] === 0">
                    <span class="font-weight-medium">Free</span>
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
                    </template>
                  </template>
                </template>
                <template v-else-if="attr.type === 'boolean'">
                  <v-icon v-if="item.attrs[name] === true" color="success">
                    {{ mdiCheck }}
                  </v-icon>
                  <template v-else-if="item.attrs[name] === false">
                    &nbsp;
                  </template>
                  <small v-else>
                    {{ item.attrs[name] }}
                  </small>
                </template>
                <template v-else-if="attr.type === 'pro'">
                  <v-chip
                    v-if="item.attrs[name] === true"
                    to="/pro/"
                    color="primary"
                    x-small
                    outlined
                  >
                    PRO
                  </v-chip>
                  <template v-else-if="item.attrs[name] === false">
                    &nbsp;
                  </template>
                  <small v-else>
                    {{ item.attrs[name] }}
                  </small>
                </template>
                <small v-else-if="attr.type === 'small'">
                  {{ item.attrs[name] }}
                </small>
                <template v-else>
                  {{ item.attrs[name].value || item.attrs[name] }}

                  <v-tooltip
                    v-if="item.attrs[name].tooltip"
                    max-width="400"
                    top
                  >
                    <template #activator="{ on }">
                      <sup>
                        <v-icon small v-on="on">{{
                          mdiHelpCircleOutline
                        }}</v-icon>
                      </sup>
                    </template>

                    <div
                      v-for="(line, index) in item.attrs[name].tooltip"
                      :key="index"
                    >
                      <br v-if="!line" />

                      {{ line }}
                    </div>
                  </v-tooltip>
                </template>
              </v-card-text>
            </v-responsive>
          </div>
          <v-responsive v-if="item.raised" height="20" />
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
import { mdiCheck, mdiHelpCircleOutline } from '@mdi/js'

import SignIn from '~/components/SignIn.vue'

export default {
  components: {
    SignIn,
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
      mdiCheck,
      mdiHelpCircleOutline,
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
  min-width: 600px;
}

.matrix__container {
  overflow-x: auto;
}

.matrix__col--raised {
  z-index: 2;
}
</style>
