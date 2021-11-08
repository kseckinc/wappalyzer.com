<template>
  <div>
    <v-divider />

    <v-simple-table :fixed-header="!!height" :height="height || null">
      <thead>
        <tr>
          <th
            v-for="(key, index) in Object.keys(sample[0])"
            :key="key"
            class="pl-0"
            style="white-space: nowrap"
          >
            <div class="d-flex align-center">
              <v-divider
                v-if="index"
                class="mr-4"
                style="height: 2.6rem"
                vertical
              />
              {{ key }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in sample" :key="index">
          <td v-for="(column, attribute) in row" class="pl-0" :key="attribute">
            <div class="d-flex align-center">
              <v-divider
                v-if="attribute !== Object.keys(row)[0]"
                class="mr-4"
                style="height: 2.6rem"
                vertical
              />

              <small
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  max-width: 200px;
                "
              >
                {{ column }}
              </small>
            </div>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
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
    height: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      mdiCheck,
    }
  },
}
</script>
