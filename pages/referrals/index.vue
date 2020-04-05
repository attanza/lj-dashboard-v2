<template>
  <v-card>
    <v-card-title class="primary--text">{{ title }}</v-card-title>
    <v-toolbar flat color="transparent">
      <Tbtn
        v-if="checkPermission('create-referral')"
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

      <v-spacer />
      <v-text-field
        v-model="options.search"
        append-icon="search"
        label="Cari"
        single-line
        hide-details
        clearable
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
        <template v-slot:item.code="{ item }">
          <v-btn text color="primary" nuxt :to="`${link}/${item._id}`">{{
            item.code
          }}</v-btn>
        </template>
        <template v-slot:item.creator="{ item }">
          <v-btn
            text
            color="primary"
            nuxt
            :to="`/marketings/${item.creator.id}`"
            >{{ item.creator.email || "" }}</v-btn
          >
        </template>

        <template v-slot:item.isExpired="{ item }">
          <span v-if="!item.isExpired">
            <v-chip color="green" text-color="white">Useable</v-chip>
          </span>
          <span v-else>
            <v-chip>Expired</v-chip>
          </span>
        </template>
        <template v-slot:item.createdAt="{ item }">{{
          $moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
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
      model="Referral"
      @onClose="showDownloadDialog = false"
    />
  </v-card>
</template>

<script>
import debounce from "lodash/debounce"
import { headers, downloadData } from "~/components/referrals/util"
import { global, catchError } from "~/mixins"
import { dform } from "~/components/referrals"
import DownloadDialog from "~/components/DownloadDialog"
export default {
  components: { DownloadDialog, dform },
  mixins: [global, catchError],
  data() {
    return {
      title: "Referral",
      link: "/referrals",
      headers: headers,
      fillable: downloadData,
      typeDates: ["created_at"],
      dataToExport: []
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
    }
  },
  mounted() {
    this.options.sortBy[0] = "createdAt"
    this.populateTable()
  },
  methods: {
    async populateTable() {
      try {
        this.activateLoader()
        const queries = this.getQueries()
        const resp = await this.$axios.$get(`${this.link + queries}`)
        this.total = resp.meta.totalDocs
        this.items = resp.data
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.showForm = false
        this.catchError(e, null, this.$router)
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
        this.showDownloadDialog = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
