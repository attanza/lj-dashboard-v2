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
        <template v-slot:item.createdAt="{ item }">{{
          $moment(item.createdAt).format("DD MMMM YYYY HH:mm:ss")
        }}</template>
      </v-data-table>
    </v-card-text>
    <DownloadDialog
      :show-dialog="showDownloadDialog"
      :data-to-export="dataToExport"
      :fillable="fillable"
      :type-dates="typeDates"
      model="Activities"
      @onClose="showDownloadDialog = false"
    />
  </v-card>
</template>

<script>
import debounce from "lodash/debounce"
import { activitiesHeaders, downloadData } from "~/components/profile/util"
import { global, catchError } from "~/mixins"
import DownloadDialog from "~/components/DownloadDialog"
export default {
  components: { DownloadDialog },
  mixins: [global, catchError],
  data() {
    return {
      title: "Activities",
      link: "/activities",
      headers: activitiesHeaders,
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
        const queries = this.getQueries()
        const resp = await this.$axios.$get(
          `${this.link + queries}search_by=user.id&search_query=${
            this.auth.user.id
          }`
        )
        this.total = resp.meta.totalDocs
        this.items = resp.data
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.showForm = false
        this.catchError(e, null, this.$router)
      }
    },
    downloadData() {
      this.dataToExport = []
      const data = [...this.items]
      data.map(d => {
        d.user = d.user ? d.user.email : ""
        delete d.__v
        delete d._id
        d.createdAt = this.$moment(d.createdAt).format("YYYY-MM-DD HH:mm:ss")
        d.updatedAt = this.$moment(d.updatedAt).format("YYYY-MM-DD HH:mm:ss")
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
