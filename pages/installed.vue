<template>
  <div>
    <Hero
      subtitle="Thank you for installing the Wappalyzer browser extension!"
      title="Wappalyzer has been installed"
    />
    <v-container class="my-sm-12">
      <v-row justify="center">
        <v-col cols="12" sm="8" lg="6" class="py-0">
          <v-card>
            <v-card-title>How it works</v-card-title>
            <v-card-text>
              <ol class="mb-8">
                <li>Go to any website</li>
                <li>Click the icon for a list of identified technologies</li>
                <li>Click on a technology or category for more insights</li>
              </ol>

              <v-btn color="accent" to="/faq/extension/" outlined>
                Frequently asked questions
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Hero from '~/components/Hero.vue'

export default {
  components: {
    Hero,
  },
  data() {
    return {
      title: 'Installation successful',
      release: null,
      error: false,
    }
  },
  created() {
    this.set({ hero: false })
  },
  methods: {
    ...mapActions({
      set: 'page/set',
    }),
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
