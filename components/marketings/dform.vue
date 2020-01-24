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
                  <div v-if="f.key !== 'is_active'">
                    <label>{{ f.caption }}</label>
                    <v-text-field
                      v-validate="f.rules"
                      v-model="formData[f.key]"
                      :error-messages="errors.collect(f.key)"
                      :name="f.key"
                      :data-vv-name="f.key"
                      :data-vv-as="f.caption"
                      :type="f.key == 'password' ? 'password' : 'text'"
                    />
                  </div>
                  <div v-if="f.key == 'is_active'">
                    <v-switch
                      v-model="formData['is_active']"
                      label="Aktif"
                      color="primary"
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
import { MARKETING_URL } from "~/utils/apis"
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
          key: "email",
          caption: "Email",
          value: "",
          rules: "required|email"
        },
        {
          key: "phone",
          caption: "Telepon",
          value: "",
          rules: "required|max:30"
        },
        {
          key: "password",
          caption: "Password",
          value: "",
          rules: "required|min:6"
        },
        {
          key: "is_active",
          caption: "Status aktif",
          value: true,
          rules: "required|boolean"
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
      formData: {},
      formTitle: "Tambah Marketing"
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    }
  },
  mounted() {
    // this.fillForms()
  },
  methods: {
    fillForms() {
      this.formData.name = "Test Marketing"
      this.formData.email = "test.marketing@yahoo.com"
      this.formData.phone = "0123456789"
      this.formData.password = "password"
      this.formData.is_active = "1"
      this.formData.address = "Test"
    },
    onClose() {
      this.$emit("onClose")
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
        this.formData.role_id = 4
        const resp = await axios
          .post(MARKETING_URL, this.formData)
          .then(res => res.data)
        if (resp.meta.status === 201) {
          showNoty("Data disimpan", "success")
          this.$emit("onAdd", resp.data)
          this.formData = {}
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
