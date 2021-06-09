<template>
  <v-simple-table>
    <thead>
      <tr>
        <th
          v-for="key in Object.keys(sample[0])"
          :key="key"
          style="white-space: nowrap"
        >
          {{ formatAttribute(key) || key }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in sample" :key="index">
        <td
          v-for="(column, attribute) in row"
          :key="attribute"
          style="
            white-space: nowrap;
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          <small>
            <template v-if="Array.isArray(column)">
              <div
                v-for="(value, index2) in column.slice(0, 3)"
                :key="index2"
                style="
                  white-space: nowrap;
                  max-width: 300px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                {{ (formatted = formatAttribute(attribute, value)) && null }}
                <a
                  v-if="formatted.to"
                  :href="formatted.to"
                  rel="noopener nofollow"
                  target="_blank"
                  >{{ formatted.text }}</a
                >
                <template v-else>
                  {{ formatted }}
                </template>
              </div>
              <div v-if="column.length > 3" class="text--disabled">
                (+{{ column.length - 3 }} more)
              </div>
            </template>
            <template v-else>
              {{ (formatted = formatAttribute(attribute, column)) && null }}
              <a
                v-if="formatted.to"
                :href="formatted.to"
                rel="noopener nofollow"
                target="_blank"
                >{{ formatted.text }}</a
              >
              <template v-else-if="formatted === 'true'">
                <v-icon color="success" small>{{ mdiCheck }}</v-icon>
              </template>
              <template v-else-if="formatted === 'false'" />
              <template v-else>
                {{ formatted }}
              </template>
            </template>
          </small>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
import { mdiCheck } from '@mdi/js'

export default {
  props: {
    sample: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      mdiCheck,
    }
  },
}
</script>
