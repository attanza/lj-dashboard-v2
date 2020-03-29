<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" fullscreen>
      <v-card>
        <v-card-title>
          <span class="primary--text headline">{{ formTitle }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <sharedForm
            :items="formItem"
            :show-button="checkPermission('create-online-product-order')"
            :show-cancel="true"
            :init-value="initValue"
            :sm6="true"
            @onClose="onClose"
            @onSubmit="saveData"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global, catchError } from "~/mixins"
import sharedForm from "../sharedForm"
import { formItem, orderStatus } from "./util"
export default {
  components: { sharedForm },
  mixins: [global, catchError],
  props: {
    show: {
      type: Boolean,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      formItem: formItem,
      orderStatus: orderStatus,
      formTitle: "Tambah Order",
      initValue: {}
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    }
  },
  methods: {
    onClose() {
      this.$emit("onClose")
    },
    async saveData(data) {
      try {
        this.activateLoader()
        const resp = await this.$axios.$post(this.link, data)
        this.showNoty(this.$messages.form.SAVED, "success")
        this.$emit("onAdd", resp.data)
        this.deactivateLoader()
      } catch (e) {
        this.dialog = false
        this.deactivateLoader()
        this.catchError(e)
      }
    }
  }
}
</script>
