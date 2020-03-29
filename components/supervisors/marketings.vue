<template>
  <div>
    <v-card flat>
      <v-container fluid grid-list-md style="padding-top: 5px;">
        <v-toolbar flat color="transparent">
          <v-toolbar-items>
            <v-text-field
              v-model="options.search"
              append-icon="search"
              label="Cari"
              single-line
              hide-details
              class="mt-2"
            />
            <v-autocomplete
              v-if="addMode && comboData"
              v-model="marketingsToAdd"
              :items="comboData"
              label="Pilih marketing"
              multiple
              item-text="name"
              item-value="id"
              autocomplete
              cache-items
              class="ml-1 mt-2"
            />
          </v-toolbar-items>
          <v-spacer />
          <Tbtn
            color="primary"
            icon="chevron_left"
            icon-mode
            tooltip-text="Kembali"
            @onClick="toHome"
          />
          <Tbtn
            v-if="!addMode"
            color="primary"
            icon="add"
            icon-mode
            tooltip-text="Tambah Marketing"
            @onClick="addMode = true"
          />
          <Tbtn
            v-if="addMode"
            color="primary"
            icon="save"
            icon-mode
            tooltip-text="Simpan"
            @onClick="addMarketing"
          />
          <Tbtn
            color="primary"
            icon="refresh"
            icon-mode
            tooltip-text="Refresh"
            @onClick="repopulateData"
          />
        </v-toolbar>
        <v-layout row wrap>
          <v-flex
            v-for="marketing in marketings"
            :key="marketing.id"
            md4
            sm6
            xs12
          >
            <v-card color="primary" dark>
              <v-img
                :src="
                  marketing.photo !== '' ? marketing.photo : '/images/user.png'
                "
                aspect-ratio="1.7"
              />

              <v-card-title>
                <div>
                  <h3 class="title mb-0">
                    {{ marketing.name }}
                  </h3>
                </div>
              </v-card-title>

              <v-card-actions>
                <v-spacer />
                <v-btn icon @click="prepareForDelete(marketing.id)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <Dialog
      :show-dialog="showDialog"
      text="Yakin mau menghapus ?"
      @onClose="clear"
      @onConfirmed="detachMarketing"
    />
  </div>
</template>

<script>
import { global, catchError } from "~/mixins"
import {
  MARKETING_URL,
  ADD_MARKETING_URL,
  DETACH_MARKETING_URL,
  COMBO_DATA_URL
} from "~/utils/apis"
import debounce from "lodash/debounce"
import union from "lodash/union"

import Dialog from "~/components/Dialog"

export default {
  components: { Dialog },
  mixins: [global, catchError],
  data() {
    return {
      showDialog: false,
      marketings: [],
      addMode: false,
      marketingsToAdd: [],
      marketingsToDelete: []
    }
  },
  watch: {
    options: {
      handler: debounce(function() {
        this.getMarketings()
      }, 500),
      deep: true
    }
  },
  mounted() {
    this.getMarketings()
  },
  methods: {
    toHome() {
      this.$router.push("/supervisors")
    },
    async getMarketings() {
      try {
        this.activateLoader()
        const queries = ``
        if (this.currentEdit) {
          const endPoint = `${MARKETING_URL}?${queries}supervisor_id=${this.currentEdit.id}`
          const resp = await this.$axios.$get(endPoint)
          this.marketings = resp.data
          this.totalItems = resp.meta.total
          this.loading = false
          this.deactivateLoader()
        }
      } catch (error) {
        this.deactivateLoader()
        this.catchError(error)
      }
    },

    async addMarketing() {
      try {
        this.activateLoader()
        this.loading = true
        if (this.marketingsToAdd.length > 0 && this.currentEdit) {
          let exisitingMarketings = []
          if (this.marketings.length) {
            this.marketings.map(m => exisitingMarketings.push(m.id))
          }
          let data = {
            supervisor_id: this.currentEdit.id,
            marketings: union(exisitingMarketings, this.marketingsToAdd)
          }
          await this.$axios.$post(ADD_MARKETING_URL, data)
          this.showNoty("Marketing ditambahkan.", "success")
          this.clear()
          this.repopulateData()
        }
        this.deactivateLoader()
      } catch (e) {
        this.clear()
        this.deactivateLoader()
        this.catchError(e)
      }
    },
    prepareForDelete(id) {
      this.marketingsToDelete.push(id)
      this.showDialog = true
    },
    async detachMarketing() {
      try {
        this.activateLoader()
        this.loading = true
        if (this.marketingsToDelete.length > 0 && this.currentEdit) {
          let data = {
            supervisor_id: this.currentEdit.id,
            marketings: this.marketingsToDelete
          }
          await this.$axios.$put(DETACH_MARKETING_URL, data)
          this.showNoty("Marketing dilepas.", "success")
          this.clear()
          this.repopulateData()
          this.deactivateLoader()
        }
      } catch (e) {
        this.clear()
        this.deactivateLoader()

        this.catchError(e)
      }
    },

    async repopulateData() {
      try {
        this.getMarketings()
        const resp = await this.$axios.$get(COMBO_DATA_URL + "Marketing")
        this.$store.commit("comboData", resp)
      } catch (e) {
        this.catchError(e)
      }
    },

    clear() {
      this.marketingsToAdd = []
      this.marketingsToDelete = []
      this.loading = false
      this.addMode = false
      this.showDialog = false
    }
  }
}
</script>

<style scoped></style>
