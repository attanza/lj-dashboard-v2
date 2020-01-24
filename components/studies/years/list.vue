<template>
  <div>
    <v-card>
      <v-card class="pt-3">
        <v-toolbar card color="transparent">
          <Tbtn
            color="primary"
            icon="chevron_left"
            icon-mode
            tooltip-text="Kembali"
            @onClick="toHome"
          />
          <Tbtn
            :bottom="true"
            :tooltip-text="'Tambah ' + title"
            icon-mode
            color="primary"
            icon="add"
            @onClick="showForm = true"
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
            <td>{{ props.item.year }}</td>
            <td>{{ props.item.class_per_year }}</td>
            <td>{{ props.item.students_per_class }}</td>
            <td>
              <v-btn icon class="mx-0" @click="toDetail(props.item)">
                <v-icon color="primary">remove_red_eye</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="showConfirm(props.item)">
                <v-icon color="primary">delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card>
      <dform
        :form="showForm"
        :is-edit="isEdit"
        :year-edit="yearEdit"
        @onClose="showForm = false"
        @onAdd="addData"
        @onEdit="editData"
      />
      <Dialog
        :showDialog="showDialog"
        text="Yakin mau menghapus ?"
        @onClose="showDialog = false"
        @onConfirmed="removeData"
      />
    </v-card>
  </div>
</template>
<script>
import _ from "lodash"
import { STUDY_YEARS_URL } from "~/utils/apis"
import { global } from "~/mixins"
import Dialog from "~/components/Dialog"
import axios from "axios"
import dform from "./dform"
import catchError, { showNoty } from "~/utils/catchError"

export default {
  middleware: "auth",
  components: { dform, Dialog },
  mixins: [global],
  data: () => ({
    title: "Angkatan",
    headers: [
      { text: "Angkatan", align: "left", value: "year" },
      {
        text: "Kelas per Angkatan",
        align: "left",
        value: "class_per_year"
      },
      { text: "Siswa per Kelas", value: "students_per_class" },
      { text: "Aksi", value: "name", sortable: false }
    ],
    items: [],
    confirmMessage: "Yakin mau menghapus ?",
    showDialog: false,
    isEdit: false,
    yearEdit: {}
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
    toHome() {
      this.$router.push("/study-programs")
    },
    searchQuery: _.debounce(function() {
      this.pupulateTable()
    }, 500),
    async pupulateTable() {
      try {
        this.activateLoader()
        this.loading = true
        const { page, rowsPerPage, descending, sortBy } = this.pagination
        const endPoint = `${STUDY_YEARS_URL}?page=${page}&limit=${rowsPerPage}&search=${this.search}&study_program_id=${this.currentEdit.id}`
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
      }
    },
    toDetail(data) {
      this.yearEdit = data
      this.isEdit = true
      this.showForm = true
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
      this.isEdit = false
    },
    editData(data) {
      let index = _.findIndex(this.items, item => item.id == data.id)
      this.items.splice(index, 1, data)
      this.yearEdit = null
      this.isEdit = false
      this.showForm = false
    },
    showConfirm(data) {
      this.showDialog = true
      this.dataToDelete = data
    },
    removeData() {
      try {
        this.activateLoader()
        axios
          .delete(STUDY_YEARS_URL + "/" + this.dataToDelete.id)
          .then(resp => {
            if (resp.status === 200) {
              let index = _.findIndex(
                this.items,
                item => item.id == this.dataToDelete.id
              )
              this.items.splice(index, 1)
              showNoty("Data dihapus", "success")
              this.showDialog = false
              this.dataToDelete = null
            }
          })
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    }
  }
}
</script>
