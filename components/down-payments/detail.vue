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
        <form>
          <v-layout row wrap>
            <v-flex v-for="(f, index) in fillable" :key="index" sm6 xs12>
              <div v-if="f.key === 'marketing_target_id'">
                <label>Kode Target Marketing</label>
                <v-autocomplete
                  v-validate="f.rules"
                  v-model="formData[f.key]"
                  :items="targetItems"
                  :loading="targetComboLoading"
                  :search-input.sync="searchTarget"
                  :error-messages="errors.collect(f.key)"
                  item-text="code"
                  item-value="id"
                  placeholder="Ketik untuk mencari kode target"
                  name="marketing_target_id"
                  data-vv-name="marketing_target_id"
                  data-vv-as="Marketing Target"
                  hide-no-data
                  hide-selected
                />
              </div>
              <div v-if="!inArray(notIncluded, f.key)">
                <label>{{ f.caption }}</label>
                <v-text-field
                  v-validate="f.rules"
                  v-model="formData[f.key]"
                  :error-messages="errors.collect(f.key)"
                  :name="f.key"
                  :data-vv-name="f.key"
                  :data-vv-as="f.caption"
                />
              </div>
              <!-- <div v-if="f.key == 'verified_at'">
                <v-checkbox
                  v-model="is_verified"
                  :disabled="is_verified"
                  label="Verified"
                  color="primary"
                />
              </div>-->
            </v-flex>
          </v-layout>
        </form>
      </v-container>
    </v-card>
    <Dialog
      :showDialog="showDialog"
      text="Yakin mau menghapus ?"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
  </div>
</template>

<script>
import { global } from "~/mixins"
import { DP_URL, COMBO_DATA_URL } from "~/utils/apis"
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
          key: "transaction_no",
          caption: "Nomor Transaksi",
          value: "",
          rules: "required"
        },
        {
          key: "name",
          caption: "Nama",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "phone",
          caption: "Telepon",
          value: "",
          rules: "required|max:30"
        },
        {
          key: "dp",
          caption: "DP",
          value: "",
          rules: "required|integer"
        },
        {
          key: "kelas",
          caption: "Kelas",
          value: "",
          rules: ""
        },
        {
          key: "produk",
          caption: "Produk",
          values: "",
          rules: ""
        },
        {
          key: "harga",
          caption: "Harga",
          values: "",
          rules: "integer"
        },
        {
          key: "verified_by",
          caption: "Verified by",
          value: "",
          rules: ""
        },
        {
          key: "verified_at",
          caption: "Verified at",
          value: "",
          rules: ""
        }
      ],
      formData: {},
      showDialog: false,
      notIncluded: ["marketing_target_id", "verified_by", "verified_at"],
      targetEntries: [],
      targetComboLoading: false,
      searchTarget: null,
      is_verified: false
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
        this.getMarketingTarget()
      }
    }
  },
  created() {
    this.setFields()
  },
  methods: {
    getMarketingTarget: debounce(async function() {
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
      // this.$router.push("/down-payments")
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
        this.is_verified = this.currentEdit.verified_at ? true : false
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
          this.formData.is_verified = this.is_verified
          const resp = await axios
            .put(DP_URL + "/" + this.currentEdit.id, this.formData)
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
      this.showDialog = false
      this.showDialog = true
    },
    async removeData() {
      try {
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await axios
            .delete(DP_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data dihapus", "success")
            this.toHome()
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
