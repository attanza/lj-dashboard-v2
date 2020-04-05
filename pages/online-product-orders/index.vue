<template>
  <v-card>
    <v-card-title class="primary--text">{{ title }}</v-card-title>
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
    <v-toolbar flat color="transparent" class="mt-2">
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
        class="mx-3"
        placeholder="Pilih range tanggal"
        :disabled="pickerDisabled"
      />
    </v-toolbar>
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
  </v-card>
</template>

<script>
import debounce from "lodash/debounce"
import { headers, downloadData } from "~/components/onlineProductOrders/util"
import { global, catchError, datePickerShortcut } from "~/mixins"
import { dform } from "~/components/onlineProductOrders"
import DownloadDialog from "~/components/DownloadDialog"
export default {
  components: { DownloadDialog, dform },
  mixins: [global, catchError, datePickerShortcut],
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
        const queries = this.getQueries()
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
