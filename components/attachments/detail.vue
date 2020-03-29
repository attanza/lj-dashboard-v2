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
        <ValidationObserver ref="observer">
          <form>
            <v-layout row wrap>
              <v-flex v-for="(f, index) in fillable" :key="index" sm6 xs12>
                <span v-if="f.key != 'marketing_target_id'">
                  <label>{{ f.caption }}</label>
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="f.value"
                    :rules="f.rules"
                  >
                    <v-text-field
                      v-model="formData[f.key]"
                      :error-messages="errors"
                      :name="f.key"
                    />
                  </ValidationProvider>
                </span>
              </v-flex>
              <v-flex v-for="(f, index) in fillable" :key="index" sm6 xs12>
                <span v-if="f.key == 'marketing_target_id'">
                  <label>Kode Jadwal</label>
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="f.value"
                    :rules="'required|integer'"
                  >
                    <v-autocomplete
                      v-model="formData['marketing_target_id']"
                      :items="targetItems"
                      :loading="targetComboLoading"
                      :search-input.sync="searchTarget"
                      :error-messages="errors"
                      item-text="code"
                      item-value="id"
                      placeholder="Ketik untuk mencari kode target"
                      name="marketing_target_id"
                      hide-no-data
                      hide-selected
                    />
                  </ValidationProvider>
                </span>
              </v-flex>
            </v-layout>
          </form>
        </ValidationObserver>
      </v-container>
    </v-card>
    <Dialog
      :show-dialog="showDialog"
      text="Yakin mau menghapus ?"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
  </div>
</template>

<script>
import { global } from "~/mixins"
import { CONTACT_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import Dialog from "~/components/Dialog"
import catchError, { showNoty } from "~/utils/catchError"
import debounce from "lodash/debounce"

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
          key: "marketing_target_id",
          caption: "Kode Target",
          value: "",
          rules: "required|integer"
        },
        {
          key: "name",
          caption: "Nama",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "title",
          caption: "Jabatan",
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
        }
      ],
      formData: {},
      formTitle: "Tambah Kontak",
      targetEntries: [],
      targetComboLoading: false,
      searchTarget: null,
      showDialog: false
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
    searchTarget() {
      if (this.searchTarget && this.searchTarget.length > 2) {
        this.getTarget()
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
    toHome() {
      // this.$router.push("/contacts")
      this.$router.go(-1)
    },
    setFields() {
      this.errors.clear()
      if (this.currentEdit) {
        this.fillable.forEach(
          data => (this.formData[data.key] = this.currentEdit[data.key])
        )
        this.targetEntries.push({
          id: this.currentEdit.target.id,
          code: this.currentEdit.target.code
        })
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
        if (this.currentEdit) {
          const resp = await axios
            .put(CONTACT_URL + "/" + this.currentEdit.id, this.formData)
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.setFields()
          showNoty("Data diperbaharui", "success")
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },
    confirmDelete() {
      this.showDialog = true
    },
    async removeData() {
      try {
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await axios
            .delete(CONTACT_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data dihapus", "success")
            this.$router.push("/contacts")
          }
        }
        this.deactivateLoader()
      } catch (e) {
        this.showDialog = false
        this.deactivateLoader()
        catchError(e)
      }
    }
  }
}
</script>
