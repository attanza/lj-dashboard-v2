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
      <v-tab href="#schedulles">
        Jadwal
      </v-tab>
      <v-tab href="#reports">
        Laporan
      </v-tab>
      <v-tab href="#dps">
        Down Payment
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail />
      </v-tab-item>
      <v-tab-item :id="'schedulles'">
        <schedulleList :target-id="$route.params.id" />
      </v-tab-item>
      <v-tab-item :id="'reports'">
        <reportList :target-id="$route.params.id" />
      </v-tab-item>
      <v-tab-item :id="'dps'">
        <downPaymentList :target-id="$route.params.id" />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { TARGET_URL } from "~/utils/apis"
import { detail } from "~/components/targets"
import { schedulleList } from "~/components/schedulles"
import { reportList } from "~/components/marketing-reports"
import { downPaymentList } from "~/components/down-payments"
import { global } from "~/mixins"
import catchError from "~/utils/catchError"

export default {
  components: { schedulleList, detail, reportList, downPaymentList },
  mixins: [global],
  async fetch({ store, params, redirect, $axios, $router, $auth }) {
    try {
      let currentEdit = await $axios.$get(TARGET_URL + "/" + params.id)
      if (currentEdit) store.commit("currentEdit", currentEdit.data)
    } catch (e) {
      if (process.client) catchError(e, $router, $auth)
      else {
        redirect("/")
      }
    }
  }
}
</script>
