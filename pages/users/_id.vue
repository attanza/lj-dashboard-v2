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
      <v-tab href="#activities">
        Aktifitas
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail />
      </v-tab-item>

      <v-tab-item :id="'activities'">
        <activities />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { USER_URL, COMBO_DATA_URL } from "~/utils/apis"
import { detail, activities } from "~/components/users"
import catchError from "~/utils/catchError"
import { global } from "~/mixins"

export default {
  components: { detail, activities },
  mixins: [global],
  async fetch({ store, params, redirect, $axios, $router, $auth }) {
    try {
      let resp = await $axios.$get(USER_URL + "/" + params.id)
      if (resp) store.commit("currentEdit", resp.data)
      // Combo / Select Data
      let combo = await $axios.$get(COMBO_DATA_URL + "Role")
      if (combo) store.commit("comboData", combo)
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
