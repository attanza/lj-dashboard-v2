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
                <v-flex
                  v-for="(f, index) in fillable"
                  v-if="!inArray(notIncluded, f.key)"
                  :key="index"
                  xs12
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
                </v-flex>
                <v-flex
                  v-for="(f, index) in fillable"
                  v-if="inArray(notIncluded, f.key)"
                  :key="index"
                  xs12
                >
                  <label>{{ f.caption }}</label>
                  <v-textarea
                    v-validate="f.rules"
                    v-model="formData[f.key]"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                    :data-vv-as="f.caption"
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
import { UNIVERSITY_URL } from "~/utils/apis"
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
          key: "name",
          caption: "Nama",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "phone",
          caption: "Telepon",
          value: null,
          rules: "max:30"
        },
        {
          key: "email",
          caption: "Email",
          value: null,
          rules: "email"
        },
        {
          key: "contact_person",
          caption: "Nama kontak",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "province",
          caption: "Provinsi",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "city",
          caption: "Kota",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "address",
          caption: "Alamat",
          value: "",
          rules: "required|max:250"
        },
        {
          key: "description",
          caption: "Deskripsi",
          value: "",
          rules: "max:250"
        }
      ],
      notIncluded: ["description", "address"],
      formData: {},
      formTitle: "Tambah Perguruan Tinggi"
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    }
  },
  created() {
    this.setFields()
  },
  methods: {
    onClose() {
      this.$emit("onClose")
    },
    setFields() {
      this.errors.clear()
      if (this.currentEdit) {
        this.fillable.forEach(data => (this.formData[data.key] = data.value))
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
        for (let key in this.formData) {
          if (this.formData[key] === "") this.formData[key] = null
        }
        const resp = await axios
          .post(UNIVERSITY_URL, this.formData)
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
