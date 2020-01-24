<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">{{ formTitle }}</span>
        </v-card-title>
        <v-container grid-list-md>
          <form>
            <v-layout row wrap class="mt-3 px-2">
              <v-flex v-for="(f, index) in fillable" :key="index" xs12>
                <div
                  v-if="
                    !inArray(notIncluded, f.key) && inArray(fieldShow, f.key)
                  "
                >
                  <label>{{ f.caption }}</label>
                  <v-text-field
                    v-validate="f.rules"
                    v-model="formData[f.key]"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                    :data-vv-as="f.caption"
                  />
                </div>
                <div v-if="!schedulleId && f.key == 'schedulle_id'">
                  <label>Kode Jadwal</label>
                  <v-autocomplete
                    v-validate="'required|integer'"
                    v-model="formData['schedulle_id']"
                    :items="schedulleItems"
                    :loading="schedulleComboLoading"
                    :search-input.sync="searchSchedulle"
                    :error-messages="errors.collect('schedulle_id')"
                    item-text="code"
                    item-value="id"
                    placeholder="Ketik untuk mencari kode jadwal"
                    name="schedulle_id"
                    data-vv-name="schedulle_id"
                    data-vv-as="Kode Jadwal"
                    hide-no-data
                    hide-selected
                  />
                </div>
                <div v-if="f.key == 'date'">
                  <label>Tanggal</label>
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu"
                    :nudge-right="40"
                    :return-value.sync="reportDate"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      v-validate="'required'"
                      slot="activator"
                      :error-messages="errors.collect('reportDate')"
                      :data-vv-name="'reportDate'"
                      :data-vv-as="'Tanggal'"
                      v-model="reportDate"
                      label="Pilih tanggal"
                      readonly
                    />
                    <v-date-picker
                      v-model="reportDate"
                      @input="$refs.menu.save(reportDate)"
                    />
                  </v-menu>
                </div>
                <div v-if="f.key == 'date'">
                  <label>Waktu</label>
                  <v-menu
                    ref="menuTime"
                    :close-on-content-click="false"
                    v-model="menuTime"
                    :nudge-right="40"
                    :return-value.sync="reportTime"
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
                      :error-messages="errors.collect('reportTime')"
                      :data-vv-name="'reportTime'"
                      :data-vv-as="'Waktu'"
                      v-model="reportTime"
                      label="Pilih waktu"
                      readonly
                    />
                    <v-time-picker
                      v-if="menuTime"
                      v-model="reportTime"
                      @change="$refs.menuTime.save(reportTime)"
                    />
                  </v-menu>
                </div>
                <div v-if="f.key == 'description' || f.key == 'result'">
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
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click.native="onClose">Tutup</v-btn>
          <v-btn color="primary" @click.native="submit">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global } from "~/mixins"
import { MARKETING_REPORTS_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
import debounce from "lodash/debounce"
import union from "lodash/union"
import moment from "moment"

export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  props: {
    show: {
      type: Boolean,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    dataToEdit: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      formTitle: "Tambah Laporan",
      fillable: [
        {
          key: "code",
          caption: "Kode Laporan",
          value: Math.floor(Date.now() / 1000).toString(),
          rules: "required|max:20"
        },
        {
          key: "schedulle_id",
          caption: "Kode Jadwal",
          value: "",
          rules: "required|integer"
        },
        {
          key: "method",
          caption: "Metode",
          value: "",
          rules: "required|max:30"
        },
        { key: "date", caption: "Tanggal", value: "", rules: "" },
        {
          key: "terms",
          caption: "Persyaratan",
          value: "",
          rules: "max:250"
        },
        {
          key: "result",
          caption: "Hasil",
          value: "",
          rules: "max:1000"
        },
        {
          key: "note",
          caption: "Catatan",
          value: "",
          rules: "max:250"
        },
        {
          key: "description",
          caption: "Deskripsi",
          value: "",
          rules: "max:1000"
        },
        {
          key: "lat",
          caption: "Latitude",
          value: "",
          rules: "decimal"
        },
        {
          key: "lng",
          caption: "Longitude",
          value: "",
          rules: "decimal"
        }
      ],
      notIncluded: ["description", "result", "date", "schedulle_id"],
      formData: {},
      schedulleEntries: [],
      schedulleComboLoading: false,
      searchSchedulle: null,
      menu: false,
      menuTime: false,
      reportDate: null,
      reportTime: null,
      fieldShow: [
        "code",
        "schedulleId",
        "method",
        "date",
        "terms",
        "note",
        "result",
        "description",
        "lat",
        "lng"
      ]
    }
  },
  computed: {
    schedulleItems() {
      let items = []
      if (this.schedulleEntries.length > 0) {
        this.schedulleEntries.map(schedulle => items.push(schedulle))
      }
      return items
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    },
    searchSchedulle() {
      if (this.searchSchedulle && this.searchSchedulle.length > 2) {
        this.getSchedulle()
      }
    },
    isEdit() {
      this.dialog = this.isEdit
      if (this.dataToEdit) {
        this.populateData(this.dataToEdit)
      }
    }
  },
  mounted() {
    this.setFields()
    this.checkFormShow()
  },
  methods: {
    async setFields() {
      this.formTitle = "Tambah Data"
      this.fillable.forEach(data => (this.formData[data.key] = data.value))
      this.reportDate = moment(Date.now()).format("YYYY-MM-DD")
      this.reportTime = moment(Date.now()).format("HH:mm:ss")
      this.errors.clear()
      if (this.schedulleId) {
        this.formData["schedulle_id"] = this.schedulleId
      }

      this.schedulleEntries = await axios
        .get(COMBO_DATA_URL + "Schedulle")
        .then(res => res.data)
    },
    checkFormShow() {
      if (
        this.currentEdit &&
        this.currentEdit.action &&
        (this.currentEdit.action.id === 2 || this.currentEdit.action.id === 3)
      ) {
        this.fieldShow = [
          "code",
          "method",
          "date",
          "schedulle_id",
          "note",
          "result",
          "description",
          "lat",
          "lng"
        ]
      }
    },
    getSchedulle: debounce(async function() {
      try {
        this.schedulleComboLoading = true
        let schedulleData = await axios
          .get(COMBO_DATA_URL + "Schedulle&search=" + this.searchSchedulle)
          .then(res => res.data)
        if (schedulleData.length > 0) {
          this.targetEntries = union(this.schedulleEntries, schedulleData)
        }
        this.schedulleComboLoading = false
      } catch (e) {
        this.schedulleComboLoading = false
        catchError(e)
      }
    }, 500),
    onClose() {
      this.setFields()
      this.$emit("onClose")
    },
    populateData(data) {
      if (data instanceof Object) {
        this.formTitle = "Edit Data"
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            this.formData[key] = data[key]
          }
        }

        this.schedulleEntries.push({
          id: data.schedulle.id,
          code: data.schedulle.code
        })

        this.reportDate = moment(data.date).format("YYYY-MM-DD")
        this.reportTime = moment(data.date).format("HH:mm:ss")
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.saveData()
          return
        }
      })
    },
    async saveData() {
      try {
        this.activateLoader()
        this.formData["date"] = this.reportDate + " " + this.reportTime
        if (this.formData["lat"]) {
          this.formData["lat"] = parseFloat(this.formData["lat"])
        } else {
          delete this.formData["lat"]
        }

        if (this.formData["lng"]) {
          this.formData["lng"] = parseFloat(this.formData["lng"])
        } else {
          delete this.formData["lng"]
        }

        if (this.isEdit) {
          const resp = await axios
            .put(
              `${MARKETING_REPORTS_URL}/${this.dataToEdit.id}`,
              this.formData
            )
            .then(res => res.data)

          if (resp.meta.status === 200) {
            showNoty("Data perbaharui", "success")
            this.$emit("onEdit", resp.data)
            this.setFields()
          }
        } else {
          const resp = await axios
            .post(MARKETING_REPORTS_URL, this.formData)
            .then(res => res.data)

          if (resp.meta.status === 201) {
            showNoty("Data disimpan", "success")
            this.$emit("onAdd", resp.data)
            this.setFields()
          }
        }
        this.deactivateLoader()
      } catch (e) {
        console.log("e", e)
        this.deactivateLoader()
        catchError(e)
      }
    }
  }
}
</script>
