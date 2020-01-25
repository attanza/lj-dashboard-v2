<template>
  <div>
    <h2 class="primary--text mb-2">{{ title }} Detail</h2>
    <v-tabs align-with-title class="white elevation-1">
      <v-tabs-slider color="white" />
      <v-tab href="#detail">Detail</v-tab>
      <v-tab href="#marketings">Marketing</v-tab>
      <v-tab-item :id="'detail'">
        <detail />
      </v-tab-item>
      <v-tab-item :id="'marketings'">
        <marketings />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { SUPERVISOR_URL, COMBO_DATA_URL } from "~/utils/apis";
import { detail, marketings } from "~/components/supervisors";
import { catchError } from "~/mixins";
export default {
  async fetch({ store, params, redirect, $axios }) {
    try {
      let resp = await $axios.$get(SUPERVISOR_URL + "/" + params.id);
      if (resp) store.commit("currentEdit", resp.data);
      // Combo / Select Data
      let combo = await $axios.$get(COMBO_DATA_URL + "Marketing");
      if (combo) store.commit("comboData", combo);
    } catch (e) {
      if (process.client) this.catchError(e);
      else {
        redirect("/");
      }
    }
  },
  mixins: [catchError],
  components: { detail, marketings },
  data() {
    return {
      title: "Supervisor"
    };
  }
};
</script>

<style scoped></style>
