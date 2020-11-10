<template>
  <v-card flat>
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
          <p class="font-italic">"{{ text }}"</p>

          <span>
            &mdash; <strong>{{ name }}</strong
            ><br />
            <small>{{ role }}</small>
          </span>
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
