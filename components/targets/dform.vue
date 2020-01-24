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
                <v-flex v-if="!studyId && universities" xs12>
                  <label>Universitas</label>
                  <v-autocomplete
                    :items="universities"
                    v-model="university_id"
                    label="Pilih Universitas"
                    single-line
                    item-text="name"
                    item-value="id"
                  />
                </v-flex>
                <v-flex v-if="!studyId && studies" xs12>
                  <label>Studi Program</label>
                  <v-autocomplete
                    v-validate="'required|numeric'"
                    :items="studies"
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
        </v-card-text>
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
import { TARGET_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      formTitle: "Tambah Target",
      code: Math.floor(Date.now() / 1000).toString(),
      university_id: "",
      study_program_id: "",
      angkatan: "",
      description: "",
      universities: [],
      studies: [],
      autoCompleteLoading: false
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    },
    start_date() {
      if (this.start_date != null) {
        this.end_date = this.start_date
      }
    },
    university_id() {
      if (this.university_id != "") {
        try {
          this.autoCompleteLoading = true
          axios
            .get(
              COMBO_DATA_URL +
                "StudyProgram&university_id=" +
                this.university_id
            )
            .then(res => {
              this.studies = res.data
              this.autoCompleteLoading = false
            })
        } catch (e) {
          catchError(e)
        }
      }
    }
  },
  created() {
    this.setAuth()
    if (this.studyId) this.study_program_id = this.studyId
    else this.initStore()
  },
  methods: {
    onClose() {
      this.clearForm()
      this.$emit("onClose")
    },
    async initStore() {
      try {
        let universities = await axios(COMBO_DATA_URL + "University").then(
          res => res.data
        )
        this.universities = universities
      } catch (e) {
        catchError(e)
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
        const resp = await axios
          .post(TARGET_URL, this.getData())
          .then(res => res.data)

        if (resp.meta.status === 201) {
          showNoty("Data disimpan", "success")
          this.$emit("onAdd", resp.data)
          this.clearForm()
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },

    getData() {
      return {
        code: this.code,
        study_program_id: this.study_program_id,
        angkatan: this.angkatan,
        description: this.description
      }
    },
    clearForm() {
      this.dialog = false
      this.code = Math.floor(Date.now() / 1000).toString()
      this.university_id = ""
      this.study_program_id = ""
      this.angkatan = ""
      this.description = ""
    }
  }
}
</script>
