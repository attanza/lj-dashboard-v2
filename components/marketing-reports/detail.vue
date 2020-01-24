<template>
  <div>
    <v-card>
      <v-container grid-list-md fluid style="padding: 0px;">
        <v-toolbar color="transparent" card>
          <v-spacer />
          <Tbtn
            color="primary"
            icon="chevron_left"
            icon-mode
            tooltip-text="Kembali"
            @onClick="toHome"
          />
          <Tbtn
            color="primary"
            icon="save"
            icon-mode
            tooltip-text="Simpan"
            @onClick="submit"
          />
          <Tbtn
            color="primary"
            icon="refresh"
            icon-mode
            tooltip-text="Refresh"
            @onClick="setFields"
          />
          <Tbtn
            color="primary"
            icon="delete"
            icon-mode
            tooltip-text="Hapus"
            @onClick="confirmDelete"
          />
        </v-toolbar>
        <v-card-text>
          <form>
            <v-layout row wrap class="mt-3 px-2">
              <v-flex v-for="(f, index) in fillable" :key="index" sm6 xs12>
                <div v-if="!inArray(notIncluded, f.key)">
                  <label>{{ f.caption }}</label>
                  <v-text-field
                    v-validate="f.rules"
                    v-model="formData[f.key]"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                    :data-vv-as="f.caption"
                    :type="inArray(typeNumber, f.key) ? 'number' : 'text'"
                  />
                </div>
                <div v-if="f.key == 'marketing_id' && comboData">
                  <label>Marketing</label>
                  <v-autocomplete
                    v-validate="f.rules"
                    :items="comboData"
                    :error-messages="errors.collect('marketing_id')"
                    :data-vv-name="'marketing_id'"
                    :data-vv-as="'Marketing'"
                    v-model="formData['marketing_id']"
                    label="Pilih marketing"
                    single-line
                    item-text="name"
                    item-value="id"
                    cache-items
                  />
                </div>
                <div v-if="f.key == 'marketing_action_id' && comboData2">
                  <label>Aksi</label>
                  <v-autocomplete
                    v-validate="f.rules"
                    :items="comboData2"
                    :error-messages="errors.collect('marketing_action_id')"
                    :data-vv-name="'marketing_action_id'"
                    :data-vv-as="'Aksi'"
                    v-model="formData['marketing_action_id']"
                    label="Pilih aksi"
                    single-line
                    item-text="name"
                    item-value="id"
                    cache-items
                  />
                </div>
                <div v-if="f.key == 'method' && marketingMethods">
                  <label>Metode</label>
                  <v-autocomplete
                    v-validate="f.rules"
                    :items="marketingMethods"
                    :error-messages="errors.collect('method')"
                    :data-vv-name="'method'"
                    :data-vv-as="'metode'"
                    v-model="formData['method']"
                    label="Pilih metode"
                    single-line
                    cache-items
                  />
                </div>
                <div v-if="f.key == 'schedulle_date'">
                  <label>Tanggal Jadwal</label>
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu"
                    :nudge-right="40"
                    :return-value.sync="formData['schedulle_date']"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      v-validate="'required'"
                      slot="activator"
                      :error-messages="errors.collect('schedulle_date')"
                      :data-vv-name="'schedulle_date'"
                      :data-vv-as="'Tanggal Jadwal'"
                      v-model="formData['schedulle_date']"
                      label="Pilih tanggal jadwal"
                      readonly
                    />
                    <v-date-picker
                      v-model="formData['schedulle_date']"
                      @input="$refs.menu.save(formData['schedulle_date'])"
                    />
                  </v-menu>
                </div>
                <div v-if="f.key == 'schedulle_time'">
                  <label>Waktu Jadwal</label>
                  <v-menu
                    ref="menuTime"
                    :close-on-content-click="false"
                    v-model="menuTime"
                    :nudge-right="40"
                    :return-value.sync="formData['schedulle_time']"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      v-validate="'required'"
                      slot="activator"
                      :error-messages="errors.collect('schedulle_time')"
                      :data-vv-name="'schedulle_time'"
                      :data-vv-as="'Waktu Jadwal'"
                      v-model="formData['schedulle_time']"
                      label="Pilih waktu jadwal"
                      readonly
                    />
                    <v-time-picker
                      v-if="menuTime"
                      v-model="start_time"
                      @change="$refs.menuTime.save(formData['schedulle_time'])"
                    />
                  </v-menu>
                </div>
                <div v-if="f.key == 'terms' || f.key == 'description'">
                  <label>{{ f.caption }}</label>
                  <v-textarea
                    v-validate="f.rules"
                    v-model="formData[f.key]"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                    :data-vv-as="f.caption"
                  />
                </div>
              </v-flex>
            </v-layout>
          </form>
        </v-card-text>
      </v-container>
    </v-card>
    <Dialog
      :showDialog="showDialog"
      text="Yakin mau menghapus ?"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
  </div>
</template>

<script>
import { global } from "~/mixins"
import { MARKETING_REPORTS_URL } from "~/utils/apis"
import axios from "axios"
import Dialog from "~/components/Dialog"
import catchError, { showNoty } from "~/utils/catchError"
import moment from "moment"

export default {
  $_veeValidate: {
    validator: "new"
  },
  components: { Dialog },
  mixins: [global],
  data() {
    return {
      fillable: [
        {
          key: "marketing_id",
          caption: "Marketing",
          value: "",
          rules: "required|integer"
        },
        {
          key: "marketing_action_id",
          caption: "Aksi",
          value: "",
          rules: "required|integer"
        },
        {
          key: "method",
          caption: "Metode",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "count_attendances",
          caption: "Jumlah Peserta",
          value: "",
          rules: "integer"
        },
        {
          key: "count_student_dps",
          caption: "Jumlah DP Siswa",
          value: "",
          rules: "integer"
        },
        {
          key: "count_shared_packages",
          caption: "Jumlah Bagi Paket",
          value: "",
          rules: "integer"
        },
        {
          key: "count_orders",
          caption: "Jumlah Pesanan",
          value: "",
          rules: "integer"
        },
        {
          key: "count_dps",
          caption: "Jumlah DP",
          value: "",
          rules: "integer"
        },
        {
          key: "count_payments",
          caption: "Jumlah Pembayaran",
          value: "",
          rules: "integer"
        },
        {
          key: "schedulle_date",
          caption: "Tanggal Jadwal",
          value: "",
          rules: "date"
        },
        {
          key: "schedulle_time",
          caption: "Waktu Jadwal",
          value: "",
          rules: "date"
        },
        { key: "lat", caption: "Latitude", value: "", rules: "" },
        { key: "lng", caption: "Longitude", value: "", rules: "" },
        { key: "result", caption: "Hasil", value: "", rules: "" },
        { key: "terms", caption: "Persyaratan", value: "", rules: "" },
        {
          key: "description",
          caption: "Deskripsi",
          value: "",
          rules: ""
        }
      ],
      notIncluded: [
        "marketing_id",
        "marketing_action_id",
        "method",
        "terms",
        "description",
        "schedulle_date",
        "schedulle_time"
      ],
      typeNumber: [
        "count_attendances",
        "count_student_dps",
        "count_shared_packages",
        "count_orders",
        "count_dps",
        "count_payments"
      ],
      marketingMethods: ["By Phone", "By Meeting"],
      formData: {},
      showDialog: false,
      menu: false,
      menuTime: false
    }
  },
  created() {
    this.setAuth()
    this.setFields()
  },
  methods: {
    toHome() {
      this.$router.push("/marketing-reports")
    },
    setFields() {
      this.errors.clear()
      if (this.currentEdit) {
        this.fillable.forEach(
          data => (this.formData[data.key] = this.currentEdit[data.key])
        )
      }
      this.formData["schedulle_date"] = moment(
        this.formData["schedulle_date"]
      ).format("YYYY-MM-DD")
      this.formData["schedulle_time"] = moment(
        this.formData["schedulle_time"]
      ).format("HH:mm:ss")
      this.formData["schedulle_id"] = this.currentEdit.schedulle_id
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.editData()
          return
        }
      })
    },
    async editData() {
      try {
        this.activateLoader()
        if (this.currentEdit) {
          this.formData.schedulle_date =
            this.formData.schedulle_date + " " + this.formData.schedulle_time
          const resp = await axios
            .put(
              MARKETING_REPORTS_URL + "/" + this.currentEdit.id,
              this.formData
            )
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.setFields()
          showNoty("Data diperbaharui", "success")
          this.deactivateLoader()
        }
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },
    confirmDelete() {
      this.showDialog = false
      this.showDialog = true
    },
    async removeData() {
      try {
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await axios
            .delete(MARKETING_REPORTS_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data dihapus", "success")
            this.$router.push("/marketing-reports")
          }
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.showDialog = false
        catchError(e)
      }
    }
  }
}
</script>
