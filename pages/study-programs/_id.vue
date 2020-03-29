<template>
  <div>
    <h2 class="headline primary--text mb-2">
      Detail Program Studi
    </h2>
    <v-tabs align-with-title class="white elevation-1">
      <v-tabs-slider color="white" />
      <v-tab href="#detail">
        Detail
      </v-tab>
      <v-tab href="#years">
        Angkatan
      </v-tab>
      <v-tab href="#maps">
        Peta
      </v-tab>
      <v-tab href="#targets">
        Target
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail />
      </v-tab-item>
      <v-tab-item :id="'years'">
        <years :study-id="$route.params.id" />
      </v-tab-item>
      <v-tab-item :id="'maps'">
        <maps />
      </v-tab-item>
      <v-tab-item :id="'targets'">
        <targets :study-id="$route.params.id" />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { STUDIES_URL } from "~/utils/apis"
import { detail, maps } from "~/components/studies"
import { list as years } from "~/components/studies/years"
import { list as targets } from "~/components/targets"

import { catchError } from "~/mixins"
export default {
  components: { detail, maps, years, targets },
  mixins: [catchError],
  async fetch({ store, params, redirect, $axios }) {
    try {
      // Current Edit
      let currentEdit = await $axios.$get(STUDIES_URL + "/" + params.id)
      if (currentEdit) store.commit("currentEdit", currentEdit.data)
    } catch (e) {
      if (process.client) this.catchError(e)
      else {
        redirect("/")
      }
    }
  }
}
</script>

<style scoped></style>
