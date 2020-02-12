<template>
  <v-card>
    <v-card-title class="primary--text">{{ title }}</v-card-title>
    <schedulleList></schedulleList>
  </v-card>
</template>

<script>
import debounce from "lodash/debounce";
import { schedulleList } from "~/components/schedulles";

export default {
  components: { schedulleList },
  data() {
    return {
      title: "Jadwal"
    };
  }
};
</script>

<style lang="scss" scoped></style>
