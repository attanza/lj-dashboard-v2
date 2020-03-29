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
        <Tbtn
          :bottom="true"
          :tooltip-text="'Download ' + title + ' data'"
          icon-mode
          color="primary"
          icon="cloud_download"
          @onClick="downloadData"
        />

        <v-spacer />
        <v-text-field
          v-model="search"
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
          <td v-if="props.item.studyName">
            <a @click="toDetail(props.item)">
              {{ props.item.studyName.name }}
            </a>
          </td>
          <td>{{ props.item.contact_person }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.email }}</td>
        </template>
      </v-data-table>
    </v-card>
    <studyForm :show="showForm" @onClose="showForm = false" @onAdd="addData" />
    <DownloadDialog
      :show-dialog="showDownloadDialog"
      :data-to-export="dataToExport"
      :fillable="fillable"
      :type-dates="typeDates"
      model="StudyProgram"
      @onClose="showDownloadDialog = false"
    />
  </div>
</template>
<script>
import _ from "lodash"
import { STUDIES_URL } from "~/utils/apis"
import { global } from "~/mixins"
import studyForm from "./studyForm"
import axios from "axios"
import catchError from "~/utils/catchError"
import DownloadDialog from "~/components/DownloadDialog"

export default {
  middleware: "auth",
  components: { studyForm, DownloadDialog },
  mixins: [global],
  data: () => ({
    title: "Study Program",

    headers: [
      { text: "Nama", align: "left", value: "study_name_id" },
      { text: "Nama kontak", value: "contact_person", align: "left" },
      { text: "Telepon", value: "phone", align: "left" },
      { text: "Email", value: "email", align: "left" }
    ],
    items: [],
    confirmMessage: "Yakin mau menghapus ?",
    showConfirm: false,
    dataToExport: [],
    fillable: [
      "id",
      "university_id",
      "study_name_id",
      "address",
      "email",
      "phone",
      "description",
      "address",
      "contact_person"
    ],
    typeDates: ["created_at"]
  }),

  watch: {
    pagination: {
      handler() {
        this.pupulateTable()
      },
      deep: true
    },
    search() {
      if (this.search != "") {
        this.searchQuery()
      }
    }
  },

  mounted() {
    this.pupulateTable()
  },

  methods: {
    searchQuery: _.debounce(function() {
      this.pupulateTable()
    }, 500),
    async pupulateTable() {
      try {
        this.activateLoader()
        this.loading = true
        const { page, rowsPerPage, descending, sortBy } = this.pagination
        const endPoint = `${STUDIES_URL}?page=${page}&limit=${rowsPerPage}&university_id=${this.currentEdit.id}&search=${this.search}`
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
        this.deactivateLoader()
        catchError(e)
      }
    },
    toDetail(data) {
      this.$router.push(`/study-programs/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    downloadData() {
      this.dataToExport = []
      this.items.map(data => {
        let d = Object.assign({}, data)
        if (d.university) delete d.university
        if (data.university) d.university = data.university.name

        if (d.studyName) delete d.studyName
        if (data.studyName) d.studyName = data.studyName.name

        if (d.years) delete d.years
        let years = ""
        if (data.years) {
          data.years.map(y => {
            let year = ""
            year += `[year: ${y.year}, class_per_year: ${y.class_per_year}, students_per_class: ${y.students_per_class}], `
            years += year
          })
        }
        d.years = years

        this.dataToExport.push(d)
      })
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>
