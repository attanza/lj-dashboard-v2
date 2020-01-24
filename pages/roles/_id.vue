<template>
  <div>
    <h2 v-if="currentEdit" class="primary--text mb-2">Role {{ currentEdit.name }}</h2>
    <v-tabs align-with-title class="white elevation-1">
      <v-tabs-slider color="white" />
      <v-tab href="#detail">Detail</v-tab>
      <v-tab href="#permissions">Permission</v-tab>
      <v-tab-item :id="'detail'">
        <detail />
      </v-tab-item>
      <v-tab-item :id="'permissions'">
        <permission />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { ROLE_URL, COMBO_DATA_URL } from "~/utils/apis";
import { detail, permission } from "~/components/roles";
import { global, catchError } from "~/mixins";

const API_URL = process.env.API_URL;

export default {
  async fetch({ store, params, redirect, $axios }) {
    try {
      let resp = await $axios.get(ROLE_URL + "/" + params.id);
      if (resp) store.commit("currentEdit", resp.data.data);

      let permissions = await $axios.get(COMBO_DATA_URL + "Permission");
      if (permissions) store.commit("comboData", permissions.data);

      let rolePermissions = await $axios.get(
        API_URL + "/role/" + params.id + "/permissions"
      );
      if (rolePermissions)
        store.commit("permissions", rolePermissions.data.data);
    } catch (e) {
      if (process.client) this.catchError(e);
      else {
        redirect("/");
      }
    }
  },
  components: { detail, permission },
  mixins: [global, catchError]
};
</script>

<style scoped></style>
