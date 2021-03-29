<template>
  <v-card class="mb-6" outlined>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="3">
          <v-avatar
            width="100%"
            height="auto"
            max-width="100"
            class="elevation-2"
          >
            <v-img :src="image" :alt="name" />
          </v-avatar>
        </v-col>
        <v-col cols="12" sm="9">
          <q class="d-block mb-4 font-italic">{{ text }}</q>

          <small>
            <strong>{{ name }}</strong
            ><br />
            {{ role }}</small
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },
}
</script>
