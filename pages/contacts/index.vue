<template>
  <v-card>
    <v-card-title class="primary--text">
      {{ title }}
    </v-card-title>
    <contactList />
  </v-card>
</template>

<script>
import { contactList } from "~/components/contacts"

export default {
  components: { contactList },
  data() {
    return {
      title: "Jadwal"
    }
  }
}
</script>

<style lang="scss" scoped></style>
