<template>
  <div>
    <h2 class="headline primary--text mb-2">Detail Nama Studi</h2>
    <v-tabs align-with-title class="white elevation-1">
      <v-tabs-slider color="white" />
      <v-tab href="#detail">Detail</v-tab>
      <v-tab-item :id="'detail'">
        <detail />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { STUDY_NAME_URL } from "~/utils/apis";
import { detail } from "~/components/study-names";
import { catchError } from "~/mixins";

export default {
  async fetch({ store, params, redirect, $axios }) {
    try {
      let resp = await $axios.$get(STUDY_NAME_URL + "/" + params.id);
      store.commit("currentEdit", resp.data);
    } catch (e) {
      if (process.client) this.catchError(e);
      else {
        redirect("/");
      }
    }
  },
  mixins: [catchError],
  components: { detail }
};
</script>

<style scoped></style>
