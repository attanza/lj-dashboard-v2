<template>
  <div>
    <v-toolbar flat color="transparent">
      <Tbtn
        v-if="checkPermission('create-study-program')"
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
        <template v-slot:item.study_name_id="{ item }">
          <v-btn text color="primary" @click="toDetail(item)">
            {{ item.studyName.name }}
          </v-btn>
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
      model="StudyProgram"
      @onClose="showDownloadDialog = false"
    />
  </div>
</template>

<script>
import debounce from "lodash/debounce"
import { headers, downloadData } from "~/components/studies/util"
import { global, catchError } from "~/mixins"
import { dform } from "~/components/studies"
import DownloadDialog from "~/components/DownloadDialog"
export default {
  components: { DownloadDialog, dform },
  mixins: [global, catchError],
  props: {
    universityId: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      title: "Program Studi",
      link: "/studies",
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
    this.populateTable()
  },
  methods: {
    async populateTable() {
      try {
        this.activateLoader()
        let queries = this.getQueries()
        if (this.universityId) {
          queries += `university_id=${this.universityId}`
        }
        const resp = await this.$axios.$get(`${this.link + queries}`)
        this.total = resp.meta.total
        this.items = resp.data
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.showForm = false
        this.catchError(e, null, this.$router)
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

<style lang="scss" scoped></style>
