<template>
  <v-card>
    <v-card-title class="primary--text">
      {{ title }}
    </v-card-title>
    <list />
  </v-card>
</template>

<script>
import { list } from "~/components/study-names"
export default {
  components: { list },
  data: () => ({
    title: "Nama Studi"
  })
}
</script>

<style lang="scss" scoped></style>
