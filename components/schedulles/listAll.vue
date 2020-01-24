<template>
  <div>
    <v-card class="pt-3">
      <v-toolbar card color="transparent">
        <Tbtn
          :bottom="true"
          :tooltip-text="'Tambah ' + title"
          icon-mode
          color="primary"
          icon="add"
          @onClick="showForm = true"
        />
        <!-- <Tbtn :bottom="true" :tooltip-text="'Download ' + title + ' data'" icon-mode color="primary" icon="cloud_download" @onClick="downloadData"/>        -->
        <v-spacer />
        <v-text-field
          v-model="pagination.search"
          append-icon="search"
          label="Cari"
          single-line
          hide-details
        />
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :rows-per-page-items="rowsPerPage"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>
            <a @click="toDetail(props.item)">{{ props.item.code }}</a>
          </td>
          <td>
            {{
              props.item.target.study.university
                ? props.item.target.study.university.name
                : ""
            }}
          </td>
          <td>
            {{
              props.item.target.study.studyName
                ? props.item.target.study.studyName.name
                : ""
            }}
          </td>
          <td>{{ props.item.marketing ? props.item.marketing.name : "" }}</td>
          <td>{{ props.item.action ? props.item.action.name : "" }}</td>
          <td>{{ props.item.date | moment("DD MMM YYYY HH:mm:ss") }}</td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData" />
    <DownloadDialog
      :show-dialog="showDownloadDialog"
      :data-to-export="dataToExport"
      :fillable="fillable"
      :type-dates="typeDates"
      model="Schedulle"
      @onClose="showDownloadDialog = false"
    />
  </div>
</template>
<script>
import { SCHEDULLE_URL } from "~/utils/apis"
import dform from "./dform"
import axios from "axios"
import catchError from "~/utils/catchError"
import DownloadDialog from "~/components/DownloadDialog"
import debounce from "lodash/debounce"
import { global } from "~/mixins"

export default {
  middleware: "auth",
  components: { DownloadDialog, dform },
  mixins: [global],

  data: () => ({
    title: "Jadwal Marketing",
    headers: [
      { text: "Kode Jadwal", align: "left", value: "code" },
      { text: "Kampus", align: "left", value: "university_name" },
      { text: "Prodi", align: "left", value: "studyName_name" },
      { text: "Marketing", align: "left", value: "marketing_id" },
      {
        text: "Aksi Kegiatan",
        align: "left",
        value: "marketing_action_id"
      },
      { text: "Tanggal", align: "left", value: "date" }
    ],
    items: [],
    showSearch: false,
    dataToExport: [],
    fillable: [
      "code",
      "marketing_target_id",
      "marketing_id",
      "marketing_action_id",
      "date",
      "description"
    ],
    typeDates: ["created_at"]
  }),

  watch: {
    pagination: {
      handler: debounce(function() {
        this.pupulateTable()
      }, 500),
      deep: true
    }
  },

  mounted() {
    this.pupulateTable()
    this.clearStore()
  },

  methods: {
    async pupulateTable() {
      try {
        this.activateLoader()
        this.loading = true

        const { descending, sortBy } = this.pagination
        const endPoint = `${SCHEDULLE_URL}?${this.getQueryParams()}marketing_target_id=${this
          .targetId || ""}`
        const res = await axios.get(endPoint).then(res => res.data)
        this.items = res.data
        this.totalItems = res.meta.total
        if (this.pagination.sortBy) {
          this.items = this.items.sort((a, b) => {
            const sortA = a[sortBy]
            const sortB = b[sortBy]

            if (descending) {
              if (sortA < sortB) return 1
              if (sortA > sortB) return -1
              return 0
            } else {
              if (sortA < sortB) return -1
              if (sortA > sortB) return 1
              return 0
            }
          })
        }
        this.loading = false
        this.deactivateLoader()
      } catch (e) {
        this.loading = false
        this.deactivateLoader()
        catchError(e)
      }
    },
    toDetail(data) {
      this.$router.push(`/schedulles/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    resetTable() {
      this.resetPagination()
      this.pupulateTable()
    },
    onSearch(data) {
      if (data.start_date == "null null") data.start_date = null
      if (data.end_date == "null null") data.end_date = null
      this.pagination.search_by = data.search_by || null
      this.pagination.search_query = data.search_query || null
      this.pagination.start_date = data.start_date
      this.pagination.end_date = data.end_date
      this.pagination.between_date = "start_date"
      this.showSearch = false
      this.pupulateTable()
    },
    downloadData() {
      this.dataToExport = []
      this.items.forEach(data => {
        let d = Object.assign({}, data)

        // Schedulle Marketing
        delete d.marketing
        delete d.marketing_id
        if (data.marketing) d.marketing = data.marketing.name

        // Add University Data
        d.university = data.study.university.name

        // Schedulle Study Program
        delete d.study
        delete d.study_id
        if (data.study) d.study = data.study.studyName.name

        // Schedulle Study Program
        delete d.action
        delete d.marketing_action_id
        if (data.action) d.action = data.action.name

        // Add Address Data
        d.address = data.study.address

        this.dataToExport.push(d)
      })
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>
