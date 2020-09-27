<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <v-col cols="3">
          <v-avatar width="100%" height="auto">
            <v-img :src="image" :alt="name" />
          </v-avatar>
        </v-col>
        <v-col cols="9">
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
