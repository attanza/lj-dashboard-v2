<template>
  <div>
    <v-card>
      <v-container grid-list-md fluid style="padding-top: 5px;">
        <v-toolbar color="transparent" card>
          <Tbtn
            :bottom="true"
            tooltip-text="Buat Jadwal"
            text="Buat Jadwal"
            color="primary"
            @onClick="schedulleFormShow = true"
          />
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
            @onClick="setField"
          />
          <Tbtn
            color="primary"
            icon="delete"
            icon-mode
            tooltip-text="Hapus"
            @onClick="confirmDelete"
          />
        </v-toolbar>
        <form class="mt-3">
          <v-layout row wrap>
            <v-flex xs12>
              <label>Kode</label>
              <v-text-field
                v-validate="'required|alpha_num|max:20'"
                v-model="code"
                :error-messages="errors.collect('code')"
                name="code"
                data-vv-name="code"
                data-vv-as="Kode"
              />
            </v-flex>
            <v-flex v-if="comboData" xs12>
              <label>Universitas</label>
              <v-autocomplete
                :items="comboData"
                v-model="university_id"
                label="Pilih Universitas"
                single-line
                item-text="name"
                item-value="id"
                cache-items
              />
            </v-flex>
            <v-flex v-if="comboData2" xs12>
              <label>Studi Program</label>
              <v-autocomplete
                v-validate="'required|numeric'"
                :items="comboData2"
                :error-messages="errors.collect('study_program_id')"
                :data-vv-name="'study_program_id'"
                :data-vv-as="'Studi Program'"
                v-model="study_program_id"
                label="Pilih Studi Program"
                single-line
                item-text="name"
                item-value="id"
              />
            </v-flex>
            <v-flex xs12>
              <label>Tahun Target</label>
              <v-text-field
                v-validate="'max:10'"
                v-model="angkatan"
                :error-messages="errors.collect('angkatan')"
                name="angkatan"
                data-vv-name="angkatan"
                data-vv-as="Angkatan"
              />
            </v-flex>
            <v-flex xs12>
              <label>Deskripsi</label>
              <v-textarea
                v-validate="'max:250'"
                v-model="description"
                :error-messages="errors.collect('description')"
                name="description"
                data-vv-name="description"
                data-vv-as="Deskripsi"
              />
            </v-flex>
          </v-layout>
        </form>
      </v-container>
    </v-card>
    <Dialog
      :showDialog="dialog"
      text="Yakin mau menghapus ?"
      @onClose="dialog = false"
      @onConfirmed="removeData"
    />
    <schedulle-form
      :show="schedulleFormShow"
      @onClose="schedulleFormShow = false"
      @onAdd="addSchedulle"
    />
  </div>
</template>

<script>
import { global } from "~/mixins"
import { TARGET_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import Dialog from "~/components/Dialog"
import catchError, { showNoty } from "~/utils/catchError"
import schedulleForm from "~/components/schedulles/dform"
export default {
  $_veeValidate: {
    validator: "new"
  },
  components: { Dialog, schedulleForm },
  mixins: [global],
  data() {
    return {
      dialog: false,
      formTitle: "Tambah Target",
      code: Math.floor(Date.now() / 1000).toString(),
      university_id: "",
      study_program_id: "",
      angkatan: "",
      description: "",
      autoCompleteLoading: false,
      schedulleFormShow: false,
      id: ""
    }
  },
  watch: {
    university_id() {
      if (this.university_id != "") {
        this.getStudy()
      }
    }
  },
  created() {
    this.setField()
  },
  methods: {
    async getStudy() {
      try {
        this.autoCompleteLoading = true
        const study = await axios
          .get(
            COMBO_DATA_URL + "StudyProgram&university_id=" + this.university_id
          )
          .then(res => res.data)
        this.$store.commit("comboData2", study)
        this.autoCompleteLoading = false
      } catch (e) {
        catchError(e)
      }
    },
    setField() {
      console.log("currentEdit :" + this.currentEdit)
      if (this.currentEdit) {
        const data = this.currentEdit
        this.university_id = data.study.university_id
        this.study_program_id = data.study_program_id
        this.angkatan = data.angkatan
        console.log("angkatan :" + this.angkatan)
        this.description = data.description
        this.code = data.code
        this.id = this.currentEdit.id
      }
    },
    toHome() {
      // this.$router.push("/targets")
      this.$router.go(-1)
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          console.log("Result :" + result)
          this.editData()
          return
        }
      })
    },
    async editData() {
      try {
        this.activateLoader()
        if (this.id) {
          const resp = await axios
            .put(TARGET_URL + "/" + this.id, this.getData())
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.setField()
          showNoty("Data diperbaharui", "success")
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },
    getData() {
      return {
        id: this.id,
        code: this.code,
        study_program_id: this.study_program_id,
        angkatan: this.angkatan,
        description: this.description
      }
    },
    confirmDelete() {
      this.dialog = true
    },
    async removeData() {
      try {
        this.activateLoader()
        if (this.currentEdit) {
          console.log("currentEdit :" + this.currentEdit)
          const resp = await axios
            .delete(TARGET_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data dihapus", "success")
            this.$router.push("/targets")
          }
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },
    addSchedulle(data) {
      this.$router.push("/schedulles/" + data.id)
    }
  }
}
</script>
