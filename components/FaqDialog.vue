<template>
  <v-dialog v-model="faqDialog" max-width="600px">
    <v-card>
      <v-card-title> Frequently asked questions </v-card-title>
      <v-card-text class="pb-0">
        <Faqs :topic="topic" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="accent" text @click="faqDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    topic: {
      type: String,
      default: 'lists',
    },
  },
}
</script>
