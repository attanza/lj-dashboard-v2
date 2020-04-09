<template>
  <v-card>
    <v-card-title class="primary--text">{{ title }}</v-card-title>
    <list></list>
  </v-card>
</template>

<script>
import list from "~/components/onlineProductOrders/list"
export default {
  components: { list },
  data() {
    return {
      title: "Produk Order"
    }
  }
}
</script>
