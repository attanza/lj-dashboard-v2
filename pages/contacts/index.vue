<template>
  <v-card>
    <v-card-title class="primary--text">{{ title }}</v-card-title>
    <contactList></contactList>
  </v-card>
</template>

<script>
import debounce from "lodash/debounce";
import { contactList } from "~/components/contacts";

export default {
  components: { contactList },
  data() {
    return {
      title: "Jadwal"
    };
  }
};
</script>

<style lang="scss" scoped></style>
