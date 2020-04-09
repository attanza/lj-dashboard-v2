<template>
  <div>
    <v-toolbar flat color="transparent">
      <Tbtn
        v-if="checkPermission('create-online-product-order')"
        :bottom="true"
        :tooltip-text="'Tambahkan ' + title"
        icon-mode
        icon="add"
        color="primary"
        @onClick="showForm = !showForm"
      />
      <Tbtn
        :bottom="true"
        :tooltip-text="'Download data ' + title"
        icon-mode
        icon="cloud_download"
        color="primary"
        @onClick="downloadData"
      />
      <v-spacer></v-spacer>
      <v-text-field
        v-model="options.search"
        append-icon="search"
        label="Cari"
        single-line
        hide-details
      />
    </v-toolbar>
    <v-expansion-panels flat>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span class="primary--text">Advance Filter</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-toolbar flat>
            <v-combobox
              v-model="betweenDate"
              :items="typeDates"
              label="Range"
              color="primary"
            />
            <v-spacer></v-spacer>
            <date-picker
              v-model="date1"
              :shortcuts="shortcuts"
              :not-after="today"
              range
              lang="eng"
              width="100%"
              placeholder="Pilih range tanggal"
              :disabled="pickerDisabled"
            />
          </v-toolbar>
          <Revenue :marketing-id="marketingId" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-text class="mt-4">
      <v-data-table
        :headers="headers"
        :items="items"
        :search="options.search"
        :loading="loading"
        :options.sync="options"
        :footer-props="footerProps"
        :server-items-length="total"
      >
        >
        <template v-slot:item.order_no="{ item }">
          <v-btn text color="primary" nuxt :to="`${link}/${item.id}`">{{
            item.order_no
          }}</v-btn>
        </template>
        <template v-slot:item.price="{ item }">{{
          item.price.toLocaleString()
        }}</template>
      </v-data-table>
    </v-card-text>
    <dform
      :show="showForm"
      :link="link"
      @onClose="showForm = false"
      @onAdd="addData"
    />
    <DownloadDialog
      :show-dialog="showDownloadDialog"
      :data-to-export="dataToExport"
      :fillable="fillable"
      :type-dates="typeDates"
      :custome-active="true"
      model="OnlineProductOrder"
      @onClose="showDownloadDialog = false"
    />
  </div>
</template>

<script>
import debounce from "lodash/debounce"
import { headers, downloadData } from "./util"
import { global, catchError, datePickerShortcut } from "~/mixins"
import dform from "./dform"
import DownloadDialog from "../DownloadDialog"
import Revenue from "../Revenue"
export default {
  components: { DownloadDialog, dform, Revenue },
  mixins: [global, catchError, datePickerShortcut],
  props: {
    marketingId: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      title: "Produk Order",
      link: "/online-product-orders",
      headers: headers,
      fillable: downloadData,
      typeDates: ["paid_at", "created_at"],
      dataToExport: [],
      betweenDate: ""
    }
  },

  watch: {
    options: {
      handler: debounce(function() {
        if (!this.loading) {
          this.populateTable()
        }
      }, 500),
      deep: true
    },
    date1() {
      this.options.between_date = this.betweenDate
      this.options.start_date = this.$moment(this.date1[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      )
      this.options.end_date = this.$moment(this.date1[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      )
      this.populateTable()
    },
    betweenDate() {
      if (this.betweenDate !== "") {
        this.pickerDisabled = false
      } else {
        this.pickerDisabled = true
      }
    }
  },
  mounted() {
    this.populateTable()
  },
  methods: {
    async populateTable() {
      try {
        this.activateLoader()
        let queries = this.getQueries()
        if (this.marketingId !== "") {
          queries += `search_by=marketing_id&search_query=${this.marketingId}`
        }
        const resp = await this.$axios.$get(`${this.link + queries}`)
        this.total = resp.meta.total
        this.items = resp.data
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.showForm = false
        this.catchError(e, this.$auth, this.$router)
      }
    },
    toDetail(data) {
      this.$router.push(`${this.link}/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    downloadData() {
      this.dataToExport = []
      this.dataToExport = this.items
      if (this.dataToExport.length) {
        this.showDownloadDialog = !this.showDownloadDialog
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
