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
        >
        <template v-slot:item.createdAt="{ item }">
          {{ $moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
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
      model="Activity"
      @onClose="showDownloadDialog = false"
    />
  </v-card>
</template>

<script>
import debounce from "lodash/debounce"
import { activityHeaders, activityDownloadData } from "./util"
import { global, catchError } from "~/mixins"
import { dform } from "~/components/roles"
import DownloadDialog from "~/components/DownloadDialog"
export default {
  components: { DownloadDialog, dform },
  mixins: [global, catchError],
  data() {
    return {
      title: "Aktifitas",
      link: "/activities",
      headers: activityHeaders,
      fillable: activityDownloadData,
      typeDates: ["createdAt"],
      dataToExport: []
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
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
  methods: {
    async populateTable() {
      try {
        this.activateLoader()
        let queries = this.getQueries()
        queries += `search_by=user.id&search_query=${this.currentEdit.id}`
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
      // this.dataToExport = this.items;
      this.items.map(i => {
        let data = Object.assign({}, i)
        data.userId = data.user.id
        data.userEmail = data.user.email
        delete data["user"]
        delete data["__v"]
        this.dataToExport.push(data)
      })
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
