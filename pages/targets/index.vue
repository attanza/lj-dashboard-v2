<template>
  <v-card>
    <v-card-title class="primary--text">
      {{ title }}
    </v-card-title>
    <list />
  </v-card>
</template>

<script>
import { list } from "~/components/targets"
import { global } from "~/mixins"

export default {
  components: { list },
  mixins: [global],
  data() {
    return {
      title: "Target Marketing "
    }
  },
  mounted() {
    this.clearStore()
  }
}
</script>

<style scoped></style>
