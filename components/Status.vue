<template>
  <v-btn
    href="https://status.wappalyzer.com"
    :class="`font-weight-regular ${ok ? 'success--text' : 'warning--text'}`"
    target="_blank"
    text
    small
  >
    <v-avatar :color="ok ? 'success' : 'warning'" size="14" class="mr-2" />
    {{ ok ? 'All systems operational' : 'Some systems degraded' }}
  </v-btn>
</template>

<script>
export default {
  data() {
    return {
      ok: true,
    }
  },
  async mounted() {
    try {
      const response = (
        await this.$axios.post(
          'https://api.uptimerobot.com/v2/getMonitors?api_key=ur1387667-0be04391f303532dfe10b42f'
        )
      ).data

      if (response && response.stat === 'ok') {
        const { monitors } = response

        this.ok = !monitors.some(({ status }) => status === 8 || status === 9)
      }
    } catch (error) {
      console.log(error)
    }
  },
}
</script>
