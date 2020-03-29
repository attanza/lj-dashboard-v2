<template>
  <div>
    <h2 v-if="currentEdit" class="headline primary--text mb-2">
      #{{ currentEdit.order_no }}
    </h2>
    <v-tabs align-with-title class="white elevation-1">
      <v-tabs-slider color="white" />
      <v-tab href="#detail">
        Detail
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { detail } from "~/components/onlineProductOrders"
import { global } from "~/mixins"

import catchError from "~/utils/catchError"

export default {
  components: { detail },
  mixins: [global],
  async fetch({ store, params, redirect, $axios, $router, $auth }) {
    try {
      let resp = await $axios.$get("/online-product-orders/" + params.id)
      if (resp) store.commit("currentEdit", resp.data)
    } catch (e) {
      if (process.client) catchError(e, $router, $auth)
      else {
        redirect("/")
      }
    }
  }
}
</script>

<style scoped></style>
