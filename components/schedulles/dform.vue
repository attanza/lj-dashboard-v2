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
                <v-flex v-if="!targetId" xs12>
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
                <v-flex v-if="marketings" xs12>
                  <label>Marketing</label>
                  <v-autocomplete
                    v-validate="'required|numeric'"
                    :items="marketings"
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
                <v-flex v-if="actions" xs12>
                  <label>Aksi</label>
                  <v-autocomplete
                    v-validate="'required|numeric'"
                    :items="actions"
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
                      format="24hr"
                      scrollable
                      min="00:01"
                      max="23:59"
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
import { SCHEDULLE_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
import debounce from "lodash/debounce"
import union from "lodash/union"

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
      formTitle: "Tambah Jadwal",
      code: Math.floor(Date.now() / 1000).toString(),
      marketing_target_id: "",
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
      schedulleTime: null,
      marketings: [],
      actions: []
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
        this.getMarketingTarget()
      }
    }
  },
  created() {
    this.initData()
    if (this.targetId) {
      this.marketing_target_id = this.targetId
    }
  },
  methods: {
    async initData() {
      try {
        this.setAuth()
        this.marketings = await axios
          .get(COMBO_DATA_URL + `MarketingAll&supervisor_id=${this.user.id}`)
          .then(res => res.data)

        this.targetEntries = await axios
          .get(COMBO_DATA_URL + "MarketingTarget")
          .then(res => res.data)

        this.actions = await axios
          .get(COMBO_DATA_URL + "Action")
          .then(res => res.data)
      } catch (e) {
        catchError(e)
      }
    },
    getMarketingTarget: debounce(async function() {
      try {
        this.targetComboLoading = true
        let targetData = await axios
          .get(COMBO_DATA_URL + "MarketingTarget&search=" + this.searchTarget)
          .then(res => res.data)
        if (targetData.length > 0) {
          this.targetEntries = union(this.targetEntries, targetData)
        }
        this.targetComboLoading = false
      } catch (e) {
        this.targetComboLoading = false
        catchError(e)
      }
    }, 500),
    onClose() {
      this.clearForm()
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
        const resp = await axios
          .post(SCHEDULLE_URL, this.getData())
          .then(res => res.data)

        if (resp.meta.status === 201) {
          showNoty("Data disimpan", "success")
          this.$emit("onAdd", resp.data)
          this.clearForm()
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
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
    clearForm() {
      this.dialog = false
      this.marketing_id = ""
      this.marketing_action_id = ""
      this.marketing_target_id = ""
      this.date = ""
      this.schedulleDate = null
      this.schedulleTime = null
      this.code = Math.floor(Date.now() / 1000).toString()
      this.description = ""
      this.errors.clear()
    }
  }
}
</script>
