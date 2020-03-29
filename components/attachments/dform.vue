<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">{{ formTitle }}</span>
        </v-card-title>
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
                <div v-if="f.key == 'marketing_target_id' && !targetId">
                  <label>Kode Target</label>
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
                </div>
                <!-- <div v-if="f.key == 'url'">
                  <v-text-field v-model="imageName" label="Select Image" prepend-icon="attach_file" @click="pickFile"/>
                  <input
                    ref="fileData"
                    type="file"
                    style="display: none"
                    accept="image/*"
                    @change="onFilePicked"
                  >
                </div>-->
              </v-flex>
            </v-layout>
          </form>
          <div v-if="!isEdit">
            <v-text-field
              v-model="imageName"
              label="Select Image"
              prepend-icon="attach_file"
              @click="pickFile"
            />
            <input
              ref="fileData"
              type="file"
              style="display: none"
              accept="image/*"
              @change="onFilePicked"
            />
          </div>
        </v-container>
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
import { COMBO_DATA_URL, ATTACHMENTS_URL } from "~/utils/apis"
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
    },
    isEdit: {
      type: Boolean,
      required: true
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
      fillable: [
        {
          key: "marketing_target_id",
          caption: "Kode Target",
          value: "",
          rules: "required|integer"
        },
        {
          key: "caption",
          caption: "Caption",
          value: "",
          rules: "max:50"
        },
        { key: "tags", caption: "Tags", value: "", rules: "max:50" },

        { key: "url", caption: "File", value: "", rules: "required" }
      ],
      notIncluded: ["marketing_target_id", "url"],
      formData: {},
      formTitle: "Tambah Lampian",
      targetEntries: [],
      targetComboLoading: false,
      searchTarget: null,
      imageName: "",
      imageUrl: "",
      imageFile: ""
    }
  },

  computed: {
    targetItems() {
      let items = []
      if (this.targetEntries.length > 0) {
        this.targetEntries.map(target => items.push(target))
      }
      return items
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
      if (this.isEdit && this.dataToEdit) {
        this.setFields()
      }
    }
  },
  created() {
    this.setFields()
  },
  methods: {
    getTarget: debounce(async function() {
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
      this.$emit("onClose")
    },
    setFields() {
      this.fillable.forEach(data => (this.formData[data.key] = data.value))
      this.errors.clear()
      if (this.isEdit && this.dataToEdit) {
        Object.keys(this.dataToEdit).map(
          key => (this.formData[key] = this.dataToEdit[key])
        )
        this.targetEntries.push({
          id: this.formData.target.id,
          code: this.formData.target.code
        })
      }
      if (this.targetId && this.targetId != 0) {
        this.formData["marketing_target_id"] = this.targetId
      }
    },
    pickFile() {
      this.$refs.fileData.click()
    },

    onFilePicked(e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.imageName = files[0].name
        if (this.imageName.lastIndexOf(".") <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
        })
      } else {
        this.clearData()
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (!this.isEdit) {
            this.saveData()
            return
          } else {
            this.editData()
            return
          }
        }
      })
    },
    async saveData() {
      try {
        this.activateLoader()
        let formData = new FormData()

        Object.keys(this.dataToEdit).map(
          key => (this.formData[key] = this.dataToEdit[key])
        )
        formData.append("file", this.imageFile)
        const resp = await axios
          .post(ATTACHMENTS_URL, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
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
    },
    async editData() {
      try {
        this.activateLoader()
        const resp = await axios
          .put(ATTACHMENTS_URL + "/" + this.dataToEdit.id, this.formData)
          .then(res => res.data)
        if (resp.meta.status === 200) {
          showNoty("Data diperbaharui", "success")
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
