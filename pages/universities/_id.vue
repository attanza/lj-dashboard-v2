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
      <v-tab href="#study">
        Program Studi
      </v-tab>
      <v-tab href="#reports">
        Laporan
      </v-tab>

      <v-tab href="#maps">
        Peta
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail />
      </v-tab-item>
      <v-tab-item :id="'study'">
        <studyList :university-id="$route.params.id" />
      </v-tab-item>
      <v-tab-item :id="'reports'">
        <reportList :university-id="$route.params.id" />
      </v-tab-item>
      <v-tab-item :id="'maps'">
        <maps />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { UNIVERSITY_URL } from "~/utils/apis"
import { detail, maps } from "~/components/university"
import { studyList } from "~/components/studies"
import { reportList } from "~/components/marketing-reports"

import catchError from "~/utils/catchError"
import { global } from "~/mixins"

export default {
  components: { detail, maps, studyList, reportList },
  mixins: [global],
  async fetch({ store, params, redirect, $axios, $router, $auth }) {
    try {
      let resp = await $axios.$get(UNIVERSITY_URL + "/" + params.id)
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
