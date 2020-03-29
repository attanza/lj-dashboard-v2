<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">
            {{ formTitle }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <form>
              <v-layout row wrap>
                <v-flex v-for="(f, index) in fillable" :key="index" xs12>
                  <label>{{ f.caption }}</label>
                  <v-text-field
                    :ref="f.key"
                    v-model="formData[f.key]"
                    v-validate="f.rules"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                    :data-vv-as="f.caption"
                    type="password"
                  />
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click.native="onClose">
            Batal
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
import { USER_URL } from "~/utils/apis"
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
          key: "password",
          caption: "Password",
          value: "",
          rules: "required|min:6"
        },
        {
          key: "password_confirmation",
          caption: "Konfirmasi password",
          value: "",
          rules: "required|confirmed:password"
        }
      ],
      formData: {},
      formTitle: "Reset Password"
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
      this.dialog = false
      this.$emit("onClose")
    },
    setFields() {
      this.errors.clear()
      this.fillable.forEach(data => (this.formData[data.key] = data.value))
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
        this.dialog = true
        const postData = Object.assign({}, this.currentEdit)
        postData.password = this.formData.password
        delete postData["marketings"]
        delete postData["roles"]
        delete postData["supervisors"]
        const resp = await axios
          .put(`${USER_URL}/${this.currentEdit.id}`, postData)
          .then(res => res.data)

        if (resp.meta.status === 200) {
          showNoty("Password diperbaharui", "success")
          this.onClose()
        }
        this.deactivateLoader()
      } catch (e) {
        this.onClose()
        this.deactivateLoader()
        catchError(e)
      }
    }
  }
}
</script>
