<template>
  <v-card>
    <v-card-title class="primary--text">
      {{ title }}
    </v-card-title>
    <downPaymentList />
  </v-card>
</template>

<script>
import { downPaymentList } from "~/components/down-payments"

export default {
  components: { downPaymentList },
  data() {
    return {
      title: "Down Payment"
    }
  }
}
</script>

<style lang="scss" scoped></style>
