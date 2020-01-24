<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
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
                      :type="inArray(typeNumber, f.key) ? 'number' : 'text'"
                    />
                  </div>
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
import { STUDY_YEARS_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  props: {
    form: {
      type: Boolean,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    yearEdit: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      fillable: [
        {
          key: "year",
          caption: "Angkatan",
          value: "",
          rules: "required|max:4"
        },
        {
          key: "class_per_year",
          caption: "Kelas per Angkatan",
          value: "",
          rules: "required|integer"
        },
        {
          key: "students_per_class",
          caption: "Siswa per Kelas",
          value: "",
          rules: "required|integer"
        },
        {
          key: "study_program_id",
          caption: "Program studi",
          value: "",
          rules: "required|integer"
        }
      ],
      formData: {},
      formTitle: "Tambah Angkatan",
      typeNumber: ["class_per_year", "students_per_class", "year"],
      notIncluded: ["study_program_id"]
    }
  },
  watch: {
    form() {
      this.dialog = this.form
    },
    isEdit() {
      this.setFields()
    }
  },
  created() {
    this.setFields()
  },
  methods: {
    onClose() {
      this.formData = {}
      this.$emit("onClose")
    },
    setFields() {
      this.errors.clear()
      if (this.currentEdit) {
        this.fillable.forEach(data => {
          if (data.key === "study_program_id") {
            data.value = this.currentEdit.id
          }
          this.formData[data.key] = data.value
        })
      }
      if (this.isEdit && this.yearEdit) {
        this.fillable.forEach(
          data => (this.formData[data.key] = this.yearEdit[data.key])
        )
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.isEdit) {
            this.putData()
          } else {
            this.postData()
          }
          return
        }
      })
    },
    async postData() {
      try {
        this.activateLoader()
        const resp = await axios
          .post(STUDY_YEARS_URL, this.formData)
          .then(res => res.data)
        if (resp.meta.status === 201) {
          showNoty("Data disimpan", "success")
          this.$emit("onAdd", resp.data)
          this.setFields()
          this.deactivateLoader()
        }
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },

    async putData() {
      try {
        this.activateLoader()
        const resp = await axios
          .put(STUDY_YEARS_URL + "/" + this.yearEdit.id, this.formData)
          .then(res => res.data)
        if (resp.meta.status === 200) {
          showNoty("Data diperbahrui", "success")
          this.$emit("onEdit", resp.data)
          this.setFields()
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
