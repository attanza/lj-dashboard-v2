<template>
  <div>
    <h2 v-if="currentEdit" class="headline primary--text mb-2">
      {{ auth.user.name }}
    </h2>
    <v-tabs align-with-title class="white elevation-1">
      <v-tabs-slider color="white" />
      <v-tab href="#detail">Detail</v-tab>
      <v-tab href="#activities">Aktifitas</v-tab>
      <v-tab-item :id="'detail'">
        <detail />
      </v-tab-item>

      <v-tab-item id="activities">
        <activities />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { detail, activities } from "~/components/profile"
import { global } from "~/mixins"

export default {
  components: { detail, activities },
  mixins: [global]
}
</script>

<style scoped></style>
