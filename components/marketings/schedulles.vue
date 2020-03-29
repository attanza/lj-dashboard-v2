<template>
  <div>
    <v-card class="pt-3">
      <v-toolbar card color="transparent">
        <!-- <Tbtn :bottom="true" :tooltip-text="'Register New ' + title " icon-mode color="primary" icon="add" @onClick="showForm = true"/> -->
        <v-spacer />
        <Tbtn
          :bottom="true"
          :tooltip-text="'Refresh'"
          color="primary"
          icon="refresh"
          @onClick="pupulateTable"
        />
        <Tbtn
          :bottom="true"
          :tooltip-text="'Cari'"
          color="primary"
          icon="search"
          @onClick="showSearch = true"
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
          <td v-if="props.item.action">
            {{ props.item.action.name }}
          </td>
          <td v-if="props.item.study.studyName">
            {{ props.item.study.studyName.name }} ~
            {{ props.item.study.university.name }}
          </td>
          <td>{{ props.item.start_date | moment("DD MMM YYYY HH:mm:ss") }}</td>
          <td>{{ props.item.end_date | moment("DD MMM YYYY HH:mm:ss") }}</td>
          <!-- <td>{{ props.item.description }}</td> -->
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="toDetail(props.item)">
              <v-icon color="primary">
                remove_red_eye
              </v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <!-- <dform :show="showForm" @onClose="showForm = false" @onAdd="addData"/> -->
    <searchForm
      :show-search="showSearch"
      @onClose="showSearch = false"
      @onSearch="onSearch"
    />
  </div>
</template>
<script>
import { SCHEDULLE_URL, COMBO_DATA_URL } from "~/utils/apis"
import { global } from "~/mixins"
import { searchForm } from "~/components/schedulles"
import axios from "axios"
import catchError from "~/utils/catchError"

export default {
  middleware: "auth",
  components: { searchForm },
  mixins: [global],
  async fetch({ store }) {
    try {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${store.state.token}`
      axios.defaults.headers.post["Content-Type"] = "application/json"
      // Marketing Combo Data
      let marketings = await axios.get(COMBO_DATA_URL + "MarketingAll")
      if (marketings) store.commit("comboData", marketings.data)
      // Study Program Combo Data
      let studies = await axios.get(COMBO_DATA_URL + "StudyProgram")
      if (studies) store.commit("comboData2", studies.data)
      // Marketing Action Combo Data
      let actions = await axios.get(COMBO_DATA_URL + "Action")
      if (actions) store.commit("comboData3", actions.data)
    } catch (e) {
      console.log(e)
      catchError(e)
    }
  },
  data: () => ({
    title: "Schedulle",
    headers: [
      { text: "Action", align: "left", value: "marketing_action_id" },
      { text: "Program Studi", align: "left", value: "study_id" },
      { text: "Tanggal Mulai", align: "left", value: "start_date" },
      { text: "Tanggal Akhir", align: "left", value: "end_date" },
      // { text: "Description", align: "left", value: "description" },
      { text: "Aksi", value: "", align: "center", sortable: false }
    ],
    items: [],
    showSearch: false,
    search_by: "",
    search_query: "",
    start_date: "",
    end_date: ""
  }),
  watch: {
    pagination: {
      handler() {
        this.pupulateTable()
      },
      deep: true
    }
  },

  mounted() {
    this.pupulateTable()
  },

  methods: {
    async pupulateTable() {
      try {
        this.loading = true
        const { page, rowsPerPage, descending, sortBy } = this.pagination
        const endPoint = `${SCHEDULLE_URL}?page=${page}&limit=${rowsPerPage}&search_by=${this.search_by}&search_query=${this.search_query}&start_date=${this.start_date}&end_date=${this.end_date}&marketing_id=${this.currentEdit.id}`
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
      } catch (e) {
        this.loading = false
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
    onSearch(data) {
      this.search_by = data.search_by
      this.search_query = data.search_query
      this.start_date = data.start_date
      this.end_date = data.end_date
      this.showSearch = false
      this.pupulateTable()
      this.search_by = ""
      this.search_query = ""
      this.start_date = ""
      this.end_date = ""
    }
  }
}
</script>
