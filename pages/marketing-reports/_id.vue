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
      <v-tab href="#maps">
        Peta
      </v-tab>

      <v-tab-item :id="'detail'">
        <detail />
      </v-tab-item>

      <v-tab-item :id="'maps'">
        <maps />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { detail, maps } from "~/components/marketing-reports"
import { global } from "~/mixins"
import catchError from "~/utils/catchError"
export default {
  components: { detail, maps },
  mixins: [global],
  async fetch({ store, params, redirect, $axios, $router, $auth }) {
    try {
      let resp = await $axios.get("/marketing-reports/" + params.id)
      if (resp) store.commit("currentEdit", resp.data.data)
    } catch (e) {
      if (process.client) {
        catchError(e, $router, $auth)
      } else {
        redirect("/")
      }
    }
  }
}
</script>

<style scoped></style>
