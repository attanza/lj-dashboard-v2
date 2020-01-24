<template>
  <div>
    <v-card>
      <v-container grid-list-md fluid style="padding-top: 5px;">
        <v-toolbar color="transparent" card>
          <div>
            <Tbtn
              :bottom="true"
              tooltip-text="Buat Laporan"
              text="Buat Laporan"
              color="primary"
              @onClick="reportFormShow = true"
            />
          </div>
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
            @onClick="setField"
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
            <v-flex xs12>
              <label>Kode Target Marketing</label>
              <v-autocomplete
                v-validate="'required|integer'"
                v-model="marketing_target_id"
                :items="targetItems"
                :loading="targetComboLoading"
                :search-input.sync="searchTarget"
                :error-messages="errors.collect('marketing_target_id')"
                item-text="code"
                item-value="id"
                placeholder="Ketik untuk mencari kode target"
                name="marketing_target_id"
                data-vv-name="marketing_target_id"
                data-vv-as="Marketing Target"
                hide-no-data
                hide-selected
              />
            </v-flex>
            <v-flex xs12>
              <label>Kode Jadwal</label>
              <v-text-field
                v-validate="'required|max:20'"
                v-model="code"
                :error-messages="errors.collect(code)"
                name="code"
                data-vv-name="code"
                data-vv-as="Kode jadwal"
              />
            </v-flex>
            <v-flex xs12>
              <label>Kampus</label>
              <v-text-field
                v-model="university_name"
                name="university_name"
                data-vv-name="university_name"
                data-vv-as="Kampus"
                readonly
              />
            </v-flex>
            <v-flex xs12>
              <label>Prodi</label>
              <v-text-field
                v-model="studyName_name"
                name="studyName_name"
                data-vv-name="studyName_name"
                data-vv-as="Prodi"
                readonly
              />
            </v-flex>
            <v-flex v-if="comboData" xs12>
              <label>Marketing</label>
              <v-autocomplete
                v-validate="'required|numeric'"
                :items="comboData"
                :error-messages="errors.collect('marketing_id')"
                :data-vv-name="'marketing_id'"
                :data-vv-as="'Marketing'"
                v-model="marketing_id"
                label="Pilih Marketing"
                single-line
                item-text="name"
                item-value="id"
                cache-items
              />
            </v-flex>
            <v-flex v-if="comboData2" xs12>
              <label>Aksi</label>
              <v-autocomplete
                v-validate="'required|numeric'"
                :items="comboData2"
                :error-messages="errors.collect('marketing_action_id')"
                :data-vv-name="'marketing_action_id'"
                :data-vv-as="'Aksi'"
                v-model="marketing_action_id"
                label="Pilih Aksi"
                single-line
                item-text="name"
                item-value="id"
                cache-items
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex sm6 xs12>
              <label>Tanggal</label>
              <v-menu
                ref="menu"
                :close-on-content-click="false"
                v-model="menu"
                :nudge-right="40"
                :return-value.sync="schedulleDate"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  v-validate="'required'"
                  slot="activator"
                  :error-messages="errors.collect('schedulleDate')"
                  :data-vv-name="'schedulleDate'"
                  :data-vv-as="'Tanggal'"
                  v-model="schedulleDate"
                  label="Pilih tanggal"
                  readonly
                />
                <v-date-picker
                  v-model="schedulleDate"
                  @input="$refs.menu.save(schedulleDate)"
                />
              </v-menu>
            </v-flex>

            <v-flex sm6 xs12>
              <label>Waktu</label>
              <v-menu
                ref="menuTime"
                :close-on-content-click="false"
                v-model="menuTime"
                :nudge-right="40"
                :return-value.sync="schedulleTime"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  v-validate="'required'"
                  slot="activator"
                  :error-messages="errors.collect('schedulleTime')"
                  :data-vv-name="'schedulleTime'"
                  :data-vv-as="'Waktu'"
                  v-model="schedulleTime"
                  label="Pilih waktu"
                  readonly
                />
                <v-time-picker
                  v-if="menuTime"
                  :allowed-hours="allowedHours"
                  :allowed-minutes="allowedMinutes"
                  v-model="schedulleTime"
                  scrollable
                  min="00:01"
                  max="23:59"
                  format="24hr"
                  @change="$refs.menuTime.save(schedulleTime)"
                />
              </v-menu>
            </v-flex>
          </v-layout>
          <v-layout>
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
    </v-card>
    <Dialog
      :showDialog="dialog"
      text="Yakin mau menghapus ?"
      @onClose="dialog = false"
      @onConfirmed="removeData"
    />
    <report-form
      :show="reportFormShow"
      :schedulle-id="schedulleId"
      @onClose="reportFormShow = false"
      @onAdd="addReport"
    />
  </div>
</template>

<script>
import { global } from "~/mixins"
import { SCHEDULLE_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import Dialog from "~/components/Dialog"
import catchError, { showNoty } from "~/utils/catchError"
import moment from "moment"
import debounce from "lodash/debounce"
import reportForm from "~/components/marketing-reports/dform"

export default {
  $_veeValidate: {
    validator: "new"
  },
  components: { Dialog, reportForm },
  mixins: [global],
  data() {
    return {
      dialog: false,
      formTitle: "Tambah Jadwal",
      reportFormShow: false,
      code: Math.floor(Date.now() / 1000).toString(),
      marketing_target_id: "",
      university_name: "",
      studyName_name: "",
      marketing_id: "",
      marketing_action_id: "",
      date: "",
      description: "",
      targetEntries: [],
      targetComboLoading: false,
      searchTarget: null,
      menu: false,
      menuTime: false,
      schedulleDate: null,
      schedulleTime: null
    }
  },
  computed: {
    targetItems() {
      let items = []
      if (this.targetEntries.length > 0) {
        this.targetEntries.map(target => items.push(target))
      }
      return items
    },
    schedulleId() {
      return this.currentEdit.id || null
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    },
    searchTarget() {
      if (this.searchTarget && this.searchTarget.length > 2) {
        this.getMarketingTarget()
      }
    }
  },
  created() {
    this.setField()
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
        console.log(e)
      }
    }, 500),
    setField() {
      if (this.currentEdit) {
        const data = this.currentEdit
        this.code = data.code
        this.marketing_target_id = data.marketing_target_id
        if (data.target.study != undefined) {
          this.university_name = data.target.study.university.name
          this.studyName_name = data.target.study.studyName.name
        }
        this.marketing_id = data.marketing_id
        this.marketing_action_id = data.marketing_action_id
        this.description = data.description
        this.date = data.date
        this.schedulleDate = moment(data.date).format("YYYY-MM-DD")
        this.schedulleTime = moment(data.date).format("HH:mm:ss")
        this.targetEntries.push({
          id: data.target.id,
          code: data.target.code
        })
      }
    },
    toHome() {
      // this.$router.push("/schedulles")
      this.$router.go(-1)
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
            .put(SCHEDULLE_URL + "/" + this.currentEdit.id, this.getData())
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.setField()
          showNoty("Data diperbaharui", "success")
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        console.log("Error " + e.toString())
        catchError(e)
      }
    },
    getData() {
      return {
        code: this.code,
        marketing_id: this.marketing_id,
        marketing_action_id: this.marketing_action_id,
        marketing_target_id: this.marketing_target_id,
        date: this.schedulleDate + " " + this.schedulleTime,
        description: this.description
      }
    },
    confirmDelete() {
      this.dialog = true
    },
    async removeData() {
      try {
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await axios
            .delete(SCHEDULLE_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data dihapus", "success")
            this.$router.push("/schedulles")
          }
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },
    addReport(data) {
      this.$router.push("/marketing-reports/" + data.id)
    }
  }
}
</script>
