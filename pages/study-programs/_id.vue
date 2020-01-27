<template>
  <div>
    <h2 class="headline primary--text mb-2">Detail Program Studi</h2>
    <v-tabs align-with-title class="white elevation-1">
      <v-tabs-slider color="white" />
      <v-tab href="#detail">Detail</v-tab>
      <v-tab href="#years">Angkatan</v-tab>
      <v-tab href="#maps">Peta</v-tab>
      <v-tab href="#targets">Target</v-tab>
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
        <targets />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { STUDIES_URL, COMBO_DATA_URL } from "~/utils/apis";
import { detail, dform, maps } from "~/components/studies";
import { list as years } from "~/components/studies/years";
import { list as targets } from "~/components/targets";

import { catchError } from "~/mixins";
export default {
  async fetch({ store, params, redirect, $axios }) {
    try {
      // Current Edit
      let currentEdit = await $axios.$get(STUDIES_URL + "/" + params.id);
      if (currentEdit) store.commit("currentEdit", currentEdit.data);

      let resp = await $axios.$get(COMBO_DATA_URL + "University");
      if (resp) store.commit("comboData", resp);
      let resp2 = await $axios.$get(COMBO_DATA_URL + "StudyName");
      if (resp2) store.commit("comboData2", resp2);
    } catch (e) {
      if (process.client) this.catchError(e);
      else {
        redirect("/");
      }
    }
  },
  components: { detail, maps, years, targets },
  mixins: [catchError]
};
</script>

<style scoped></style>
