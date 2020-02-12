<template>
  <v-card>
    <v-card-title class="primary--text">{{ title }}</v-card-title>
    <downPaymentList></downPaymentList>
  </v-card>
</template>

<script>
import debounce from "lodash/debounce";
import { downPaymentList } from "~/components/down-payments";

export default {
  components: { downPaymentList },
  data() {
    return {
      title: "Down Payment"
    };
  }
};
</script>

<style lang="scss" scoped></style>
