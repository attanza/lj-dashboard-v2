<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <form>
              <v-layout row wrap>
                <v-flex v-for="(f, index) in fillable" :key="index" xs12>
                  <span v-if="f.key != 'marketing_target_id' && f.show">
                    <label>{{ f.caption }}</label>
                    <v-text-field
                      v-model="formData[f.key]"
                      v-validate="f.rules"
                      :error-messages="errors.collect(f.key)"
                      :name="f.key"
                      :data-vv-name="f.key"
                      :data-vv-as="f.caption"
                      type="number"
                    />
                  </span>
                  <span v-if="targetId == 0 && f.key == 'marketing_target_id'">
                    <label>Kode Jadwal</label>
                    <v-autocomplete
                      v-model="formData['marketing_target_id']"
                      v-validate="'required|integer'"
                      :items="targetItems"
                      :loading="targetComboLoading"
                      :search-input.sync="searchTarget"
                      :error-messages="errors.collect('marketing_target_id')"
                      item-text="code"
                      item-value="id"
                      placeholder="Ketik untuk mencari kode target"
                      name="marketing_target_id"
                      data-vv-name="marketing_target_id"
                      data-vv-as="Kode Target"
                      hide-no-data
                      hide-selected
                    />
                  </span>
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click.native="onClose">
            Tutup
          </v-btn>
          <v-btn color="primary" @click.native="submit">
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global } from "~/mixins"
import { TARGET_YEARS, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
import _ from "lodash"

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
      formTitle: "Tambah Angkatan",
      fillable: [
        {
          key: "marketing_target_id",
          caption: "Kode Target",
          value: "",
          rules: "required|integer",
          show: false
        },
        {
          key: "year",
          caption: "Angkatan",
          value: "",
          rules: "required|max:4",
          show: false
        },
        {
          key: "class",
          caption: "Jumlah Kelas",
          value: "",
          rules: "required|integer",
          show: false
        },
        {
          key: "students",
          caption: "Jumlah Siswa",
          value: "",
          rules: "required|integer",
          show: false
        },
        {
          key: "count_attendence",
          caption: "Jumlah Hadir",
          value: "",
          rules: "integer",
          show: false
        },
        {
          key: "people_dp",
          caption: "Jumlah Orang DP",
          value: "",
          rules: "integer",
          show: false
        },
        {
          key: "count_dp",
          caption: "Total DP Diterima",
          value: "",
          rules: "integer",
          show: false
        },
        {
          key: "count_add",
          caption: "Jumlah Tambah",
          value: "",
          rules: "integer",
          show: false
        },
        {
          key: "count_cancel",
          caption: "Jumlah Batal",
          value: "",
          rules: "integer",
          show: false
        },
        {
          key: "count_packages",
          caption: "Jumlah Bagi Paket",
          value: "",
          rules: "integer",
          show: false
        }
      ],
      formData: {},
      targetEntries: [],
      targetComboLoading: false,
      searchTarget: null
    }
  },

  computed: {
    targetItems() {
      let items = []
      if (this.targetEntries.length > 0) {
        this.targetEntries.map(target => items.push(target))
      }
      return items
    },
    actionId() {
      return this.currentEdit.schedulle.marketing_action_id || 0
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    },
    searchTarget() {
      if (this.searchTarget && this.searchTarget.length > 2) {
        this.getTarget()
      }
    },
    isEdit() {
      this.dialog = this.isEdit
      if (this.isEdit) {
        this.populateData()
      }
    }
  },
  created() {
    this.setFields()
  },
  methods: {
    getTarget: _.debounce(async function() {
      try {
        this.targetComboLoading = true
        this.targetEntries = await axios
          .get(COMBO_DATA_URL + "MarketingTarget&search=" + this.searchTarget)
          .then(res => res.data)
        this.targetComboLoading = false
      } catch (e) {
        this.targetComboLoading = false
        catchError(e)
      }
    }, 500),
    onClose() {
      this.formTitle = "Tambah Kontak"
      this.formData = {}
      this.setFields()
      this.$emit("onClose")
    },
    setFields() {
      this.fillable.forEach(data => (this.formData[data.key] = data.value))
      this.errors.clear()
      if (this.targetId && this.targetId != 0) {
        this.formData["marketing_target_id"] = this.targetId
      }
      this.showFormField()
    },
    showFormField() {
      if (this.actionId === 1 || this.actionId === 2 || this.actionId === 3) {
        let shouldShow = ["year", "class", "students"]
        this.setShouldShow(shouldShow)
      } else return null
    },
    setShouldShow(shouldShow) {
      shouldShow.map(f => {
        let fill = _.find(this.fillable, ["key", f])
        fill.show = true
      })
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.saveData()
          return
        }
      })
    },
    populateData() {
      if (this.dataToEdit) {
        this.formTitle = "Edit Kontak"
        this.formData.marketing_target_id = this.dataToEdit.marketing_target_id
        this.formData.year = this.dataToEdit.year
        this.formData.class = this.dataToEdit.class
        this.formData.students = this.dataToEdit.students
        this.formData.count_attendence = this.dataToEdit.count_attendence
        this.formData.people_dp = this.dataToEdit.people_dp
        this.formData.count_dp = this.dataToEdit.count_dp
        this.formData.count_add = this.dataToEdit.count_add
        this.formData.count_cancel = this.dataToEdit.count_cancel
        this.formData.count_packages = this.dataToEdit.count_packages
      }
    },
    parseFormData(dataToParse) {
      let data = {}

      Object.keys(dataToParse).map(
        key => (data[key] = dataToParse[key] == "" ? null : dataToParse[key])
      )
      return data
    },
    async saveData() {
      try {
        this.activateLoader()
        let httpData = this.parseFormData(this.formData)
        if (this.isEdit) {
          const resp = await axios
            .put(`${TARGET_YEARS}/${this.dataToEdit.id}`, httpData)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data diperbaharui", "success")
            this.$emit("onEdit", resp.data)
            this.setFields()
          }
        } else {
          const resp = await axios
            .post(TARGET_YEARS, httpData)
            .then(res => res.data)
          if (resp.meta.status === 201) {
            showNoty("Data disimpan", "success")
            this.$emit("onAdd", resp.data)
            this.setFields()
          }
        }
        this.deactivateLoader()
      } catch (e) {
        console.log(e)
        this.deactivateLoader()
        catchError(e)
      }
    }
  }
}
</script>
