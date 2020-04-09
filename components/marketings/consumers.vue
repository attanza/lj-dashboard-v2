<template>
  <v-card flat>
    <v-toolbar flat color="transparent">
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
      </v-data-table>
    </v-card-text>
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
import { consumerHeaders, downloadData } from "./util"
import { global, catchError } from "~/mixins"

import DownloadDialog from "~/components/DownloadDialog"
export default {
  components: { DownloadDialog },
  mixins: [global, catchError],
  data() {
    return {
      title: "Referral",
      link: "/referrals",
      headers: consumerHeaders,
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
    this.populateTable()
  },
  methods: {
    async populateTable() {
      try {
        this.activateLoader()
        const queries =
          this.getQueries() +
          `select=consumer&search_by=creator.id&search_query=${this.currentEdit.id}`

        const resp = await this.$axios.$get(`${this.link + queries}`)
        this.total = resp.meta.totalDocs
        resp.data.map(data => {
          data.consumer.map(c => {
            this.items.push({
              email: c.email,
              date: c.date
            })
          })
        })
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
    downloadData() {
      this.dataToExport = []
      const data = [...this.items]
      data.map(d => {
        d.creator = d.creator.email
        delete d.maxConsumer
        delete d._id
        delete d.validUntil
        delete d.products
        delete d.updatedAt
        delete d.__v
        const consumer = d.consumer.map(c => c.email)
        d.consumer = consumer.join(",")
        d.date = this.$moment(d.createdAt).format("YYYY-MM-DD HH:mm:ss")
        delete d.createdAt
        this.dataToExport.push(d)
      })
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
