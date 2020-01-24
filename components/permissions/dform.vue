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
                  <label>Permission</label>
                  <v-text-field
                    v-validate="'required|max:50'"
                    v-model="name"
                    :error-messages="errors.collect('name')"
                    name="name"
                    data-vv-name="name"
                    data-vv-as="Permission"
                  />
                </v-flex>
                <v-flex sm12>
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
import { PERMISSION_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
import debounce from "lodash/debounce"
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
      formTitle: "Tambah Permission",
      name: "",
      description: ""
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    },
    name() {
      this.createSlug(this.name)
    }
  },
  methods: {
    onClose() {
      this.clearForm()
      this.$emit("onClose")
    },
    clearForm() {
      this.name = ""
      this.description = ""
      this.errors.clear()
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
        let formData = {
          name: this.name,
          description: this.description
        }
        const resp = await axios
          .post(PERMISSION_URL, formData)
          .then(res => res.data)
        if (resp.meta.status === 201) {
          showNoty("Data disimpan", "success")
          this.$emit("onAdd", resp.data)
          this.clearForm()
        }
        this.deactivateLoader()
      } catch (e) {
        this.dialog = false
        this.deactivateLoader()
        catchError(e)
      }
    },
    createSlug: debounce(function(name) {
      this.slug = this.setSnakeCase(name)
    }, 500)
  }
}
</script>
