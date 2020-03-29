<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent fullscreen>
      <v-card>
        <v-card-title>
          <span class="primary--text headline">
            {{ formTitle }}
          </span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <sharedForm
            :items="formItem"
            :show-button="checkPermission('create-user')"
            :show-cancel="true"
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
import { formItem } from "./util"
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
      formTitle: "Tambah User"
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    async getRoles() {
      try {
        const index = this.formItem.findIndex(f => f.value === "roles")
        if (index !== -1) {
          const resp = await this.$axios.get("/combo-data?model=Role")
          this.formItem[index].items = resp.data
        }
      } catch (e) {
        this.catchError(e)
      }
    },
    onClose() {
      this.$emit("onClose")
    },
    async saveData(data) {
      data.roles = [data.roles]
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
