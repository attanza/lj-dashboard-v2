<template>
  <div>
    <v-card>
      <v-container grid-list-md fluid style="padding-top: 5px;">
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
              <div v-if="f.key == 'study_name_id' && comboData2">
                <label>Nama Studi</label>
                <v-autocomplete
                  v-validate="'required|numeric'"
                  :items="comboData2"
                  :error-messages="errors.collect('study_name_id')"
                  :data-vv-name="'study_name_id'"
                  :data-vv-as="'Nama studi'"
                  v-model="formData['study_name_id']"
                  label="Select Study Name"
                  single-line
                  item-text="name"
                  item-value="id"
                  cache-items
                />
              </div>
              <div v-if="f.key == 'university_id' && comboData">
                <label>Universitas</label>
                <v-autocomplete
                  v-validate="'required|numeric'"
                  :items="comboData"
                  :error-messages="errors.collect('university_id')"
                  :data-vv-name="'university_id'"
                  :data-vv-as="'Universitas'"
                  v-model="formData['university_id']"
                  label="Select University"
                  single-line
                  item-text="name"
                  item-value="id"
                  cache-items
                />
              </div>
              <div v-if="f.key == 'address' || f.key == 'description'">
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
import { STUDIES_URL } from "~/utils/apis"
import axios from "axios"
import Dialog from "~/components/Dialog"
import catchError, { showNoty } from "~/utils/catchError"

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
          key: "study_name_id",
          caption: "Nama Studi",
          value: "",
          rules: "required|integer"
        },
        {
          key: "university_id",
          caption: "Universitas",
          value: "",
          rules: "integer"
        },
        {
          key: "phone",
          caption: "Telepon",
          value: "",
          rules: "max:30"
        },
        {
          key: "email",
          caption: "Email",
          value: "",
          rules: "email"
        },
        {
          key: "contact_person",
          caption: "Nama kontak",
          value: "",
          rules: "required|max:50"
        },
        { key: "lat", caption: "Latitude", value: null, rules: "" },
        { key: "lng", caption: "Longitude", value: null, rules: "" },
        {
          key: "address",
          caption: "Alamat",
          value: "",
          rules: "max:250"
        },
        {
          key: "description",
          caption: "Deskripsi",
          value: "",
          rules: "max:250"
        }
      ],
      notIncluded: [
        "year",
        "university_id",
        "description",
        "address",
        "study_name_id"
      ],
      showDialog: false,
      formData: {},
      years: [],
      typeNumber: ["lat", "lng"]
    }
  },
  created() {
    this.setFields()
    this.setYears()
  },
  methods: {
    toHome() {
      // this.$router.push("/study-programs")
      this.$router.go(-1)
    },
    setFields() {
      this.errors.clear()
      if (this.currentEdit) {
        this.fillable.forEach(
          data => (this.formData[data.key] = this.currentEdit[data.key])
        )
      }
    },
    setYears() {
      for (let i = 2000; i < 2030; i++) {
        this.years.push(i.toString())
      }
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
        for (let key in this.formData) {
          if (this.formData.hasOwnProperty(key)) {
            if (key == "lat" || key == "lng") {
              this.formData[key] = parseFloat(this.formData[key])
            }
          }
        }
        if (this.currentEdit) {
          const resp = await axios
            .put(STUDIES_URL + "/" + this.currentEdit.id, this.formData)
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
            .delete(STUDIES_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data dihapus", "success")
            this.$router.push("/study-programs")
          }
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    }
  }
}
</script>
