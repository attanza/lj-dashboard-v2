<template>
  <div>
    <h2 class="primary--text mb-2">{{ title }} Detail</h2>
    <v-tabs align-with-title class="white elevation-1">
      <v-tabs-slider color="white" />
      <v-tab href="#detail">Detail</v-tab>
      <v-tab href="#roles">Role</v-tab>
      <v-tab href="#activities">Aktifitas</v-tab>
      <v-tab-item :id="'detail'">
        <detail />
      </v-tab-item>
      <v-tab-item :id="'roles'">
        <roles />
      </v-tab-item>
      <v-tab-item :id="'activities'">
        <activities />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { USER_URL, COMBO_DATA_URL } from "~/utils/apis";
import { detail, dform, roles, activities } from "~/components/users";
import { catchError } from "~/mixins";

export default {
  async fetch({ store, params, redirect, $axios }) {
    try {
      let resp = await $axios.$get(USER_URL + "/" + params.id);
      if (resp) store.commit("currentEdit", resp.data);
      // Combo / Select Data
      let combo = await $axios.$get(COMBO_DATA_URL + "Role");
      if (combo) store.commit("comboData", combo);
    } catch (e) {
      if (process.client) this.catchError(e);
      else {
        redirect("/");
      }
    }
  },
  mixins: [catchError],
  components: { detail, dform, roles, activities },
  data() {
    return {
      title: "User"
    };
  }
};
</script>

<style scoped></style>
