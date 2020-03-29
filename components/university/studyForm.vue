<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">
            {{ formTitle }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <form>
              <v-layout row wrap class="mt-3 px-2">
                <v-flex v-for="(f, index) in fillable" :key="index" xs12>
                  <div v-if="!inArray(notIncluded, f.key)">
                    <label>{{ f.caption }}</label>
                    <v-text-field
                      v-model="formData[f.key]"
                      v-validate="f.rules"
                      :error-messages="errors.collect(f.key)"
                      :name="f.key"
                      :data-vv-name="f.key"
                      :data-vv-as="f.caption"
                    />
                  </div>
                  <div v-if="f.key == 'study_name_id' && comboData">
                    <label>Nama Studi</label>
                    <v-autocomplete
                      v-model="formData['study_name_id']"
                      v-validate="'required|numeric'"
                      :items="comboData"
                      :error-messages="errors.collect('study_name_id')"
                      :data-vv-name="'study_name_id'"
                      :data-vv-as="'Nama studi'"
                      label="Pilih nama program studi"
                      single-line
                      item-text="name"
                      item-value="id"
                    />
                  </div>
                  <div v-if="f.key == 'address' || f.key == 'description'">
                    <label>{{ f.caption }}</label>
                    <v-textarea
                      v-model="formData[f.key]"
                      v-validate="f.rules"
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
import { STUDIES_URL, COMBO_DATA_URL } from "~/utils/apis"
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
          rules: "required|integer"
        },
        {
          key: "phone",
          caption: "Telepon",
          value: "",
          rules: "required|max:30"
        },
        {
          key: "email",
          caption: "Email",
          value: "",
          rules: "required|email"
        },
        {
          key: "contact_person",
          caption: "Nama kontak",
          value: "",
          rules: "required|max:50"
        },
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
      notIncluded: ["description", "address", "university_id", "study_name_id"],
      formData: {},
      formTitle: "Tambah Program Studi",
      years: []
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    }
  },
  async created() {
    try {
      this.setAuth()
      let resp = await axios.get(COMBO_DATA_URL + "StudyName")
      if (resp) this.$store.commit("comboData", resp.data)
      this.setFields()
    } catch (e) {
      catchError(e)
    }
  },
  methods: {
    onClose() {
      this.formData = {}
      this.$emit("onClose")
    },
    setFields() {
      this.errors.clear()
      this.fillable.forEach(data => (this.formData[data.key] = data.value))
      if (this.currentEdit) {
        this.formData.university_id = this.currentEdit.id
        this.formData.phone = this.currentEdit.phone
        this.formData.email = this.currentEdit.email
        this.formData.contact_person = this.currentEdit.contact_person
        this.formData.address = this.currentEdit.address
        this.formData.description = this.currentEdit.description
        this.formData.lat = this.currentEdit.lat
        this.formData.lng = this.currentEdit.lng
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
          .post(STUDIES_URL, this.formData)
          .then(res => res.data)
        if (resp.meta.status === 201) {
          showNoty("Data disimpan", "success")
          this.$emit("onAdd", resp.data)
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
