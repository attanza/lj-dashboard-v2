<template>
  <div>
    <h2 v-if="currentEdit" class="headline primary--text mb-2">
      {{ currentEdit.name }}
    </h2>
    <v-tabs align-with-title class="white elevation-1">
      <v-tabs-slider color="white" />
      <v-tab href="#detail">
        Detail
      </v-tab>
      <v-tab href="#referrals">
        Referrals
      </v-tab>
      <v-tab href="#consumers">
        Consumers
      </v-tab>
      <v-tab href="#orderList">
        Order List
      </v-tab>
      <v-tab-item id="detail">
        <detail />
      </v-tab-item>
      <v-tab-item id="referrals">
        <referrals />
      </v-tab-item>
      <v-tab-item id="consumers">
        <consumers />
      </v-tab-item>
      <v-tab-item id="orderList">
        <list :marketing-id="$route.params.id" />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { MARKETING_URL } from "~/utils/apis"
import { detail, referrals, consumers } from "~/components/marketings"
import list from "~/components/onlineProductOrders/list"
import catchError from "~/utils/catchError"
import { global } from "~/mixins"

export default {
  components: { detail, referrals, consumers, list },
  mixins: [global],
  async fetch({ store, params, redirect, $axios, $router, $auth }) {
    try {
      const resp = await $axios.$get(MARKETING_URL + "/" + params.id)
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
