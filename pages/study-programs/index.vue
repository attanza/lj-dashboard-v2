<template>
  <v-card>
    <v-card-title class="primary--text">
      {{ title }}
    </v-card-title>
    <studyList />
  </v-card>
</template>

<script>
import { studyList } from "~/components/studies"
export default {
  components: { studyList },
  data: () => ({
    title: "Program Studi"
  })
}
</script>

<style lang="scss" scoped></style>
