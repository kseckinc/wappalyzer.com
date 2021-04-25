<template>
  <div style="width: 100%">
    <v-expansion-panel v-for="(set, setKey) in attributes" :key="setKey" flat>
      <v-expansion-panel-header class="subtitle-2" style="line-height: 1em"
        >{{ set.title }}

        <span>
          <v-chip class="ml-2 text--disabled" small outlined>{{
            Object.values(set.attributes).reduce(
              (total, { values }) => total + values.length,
              0
            )
          }}</v-chip>
        </span>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="nopadding">
        <v-sheet
          v-if="limited && ['email', 'phone', 'social'].includes(setKey)"
          class="py-4 px-6"
          color="secondary"
          outlined
        >
          <v-btn color="accent" outlined small @click="$emit('signIn')"
            >Sign up for free to reveal</v-btn
          >
        </v-sheet>
        <v-simple-table>
          <tbody>
            <tr
              v-for="(attribute, attributeKey) in set.attributes"
              :key="attributeKey"
            >
              <th
                v-if="!['email', 'phone'].includes(attributeKey)"
                class="pl-6"
                width="30%"
              >
                {{ attribute.title }}
              </th>
              <td class="px-6">
                <v-chip-group
                  v-if="
                    ['email', 'phone'].includes(attributeKey) ||
                    setKey === 'social'
                  "
                  column
                >
                  <div v-for="(value, index) in attribute.values" :key="index">
                    <v-chip
                      v-if="attributeKey === 'email'"
                      :href="`mailto:${value.text}`"
                      color="accent"
                      small
                      outlined
                      label
                    >
                      <span :class="limited ? 'blurred' : ''">
                        {{ value.text }}
                      </span>
                    </v-chip>
                    <v-chip
                      v-else-if="attributeKey === 'phone'"
                      :href="`tel:${value.text}`"
                      color="accent"
                      small
                      outlined
                      label
                    >
                      <span :class="limited ? 'blurred' : ''">
                        {{ value.text }}
                      </span>
                    </v-chip>
                    <v-chip
                      v-else-if="value.to"
                      :href="value.to"
                      rel="nofollow noopener"
                      target="_blank"
                      color="accent"
                      small
                      outlined
                      label
                    >
                      <span :class="limited ? 'blurred' : ''">
                        {{ value.text }}
                      </span></v-chip
                    >
                  </div>
                </v-chip-group>
                <template v-else>
                  <div v-for="(value, index) in attribute.values" :key="index">
                    <v-icon v-if="value.text === true" color="success" small>{{
                      mdiCheck
                    }}</v-icon>
                    <v-icon
                      v-else-if="value.text === false"
                      color="error"
                      small
                      >{{ mdiClose }}</v-icon
                    >
                    <div v-else class="my-2">
                      {{ value.text }}
                    </div>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import { mdiCheck, mdiClose } from '@mdi/js'

export default {
  props: {
    hostname: {
      type: Object,
      default() {
        return {}
      },
    },
    limited: {
      type: Boolean,
      defuault: false,
    },
  },
  data() {
    return {
      mdiCheck,
      mdiClose,
    }
  },
  computed: {
    attributes() {
      return this.transformAttributes(
        ['locale', 'email', 'phone', 'social', 'meta'],
        this.hostname
      )
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
}
</style>
