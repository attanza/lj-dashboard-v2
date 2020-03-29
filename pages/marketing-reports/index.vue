<template>
  <v-card>
    <v-card-title class="primary--text">
      {{ title }}
    </v-card-title>
    <reportList />
  </v-card>
</template>

<script>
import { reportList } from "~/components/marketing-reports"

export default {
  components: { reportList },
  data() {
    return {
      title: "Laporan"
    }
  }
}
</script>

<style lang="scss" scoped></style>
