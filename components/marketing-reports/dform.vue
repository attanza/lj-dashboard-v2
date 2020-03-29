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
            :show-button="checkPermission('create-marketing-report')"
            :show-cancel="true"
            :init-value="initValue"
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
import { formItem, marketingMethods } from "./util"
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
      formTitle: "Tambah Laporan",
      initValue: {}
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    }
  },

  mounted() {
    this.generateCode()
    this.populateSchedulle()
    this.populateMethod()
  },

  methods: {
    onClose() {
      this.$emit("onClose")
    },
    generateCode() {
      const code = this.$moment().unix()
      this.initValue.code = code
    },
    async populateSchedulle() {
      try {
        const resp = await this.$axios.$get("/combo-data?model=Schedulle")
        const targetData = resp.map(r => ({ id: r.id, name: r.code }))
        const idx = this.formItem.findIndex(f => f.value === "schedulle_id")
        if (idx !== -1) {
          this.formItem[idx].items = targetData
        }
      } catch (e) {
        this.catchError(e)
      }
    },
    populateMethod() {
      const methodData = []
      marketingMethods.map(m => methodData.push({ id: m, name: m }))
      const idx = this.formItem.findIndex(f => f.value === "method")
      if (idx !== -1) {
        this.formItem[idx].items = methodData
      }
    },

    async saveData(data) {
      try {
        data.date = `${data.date} ${data.time}`
        delete data["time"]
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
