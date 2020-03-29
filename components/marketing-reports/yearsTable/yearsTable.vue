<template>
  <div class="mt-4">
    <h3 class="subheading ml-3">
      Angkatan
    </h3>
    <v-toolbar flat color="transparent">
      <Tbtn
        :bottom="true"
        tooltip-text="Tambah angkatan"
        icon-mode
        color="primary"
        icon="add"
        @onClick="showForm = true"
      />
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
      :headers="getHeaders"
      :items="items"
      :loading="loading"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :rows-per-page-items="rowsPerPage"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td
          v-if="
            getActionId() === 1 || getActionId() === 2 || getActionId() === 3
          "
        >
          {{ props.item.year }}
        </td>
        <td>{{ props.item.class }}</td>
        <td>{{ props.item.students }}</td>
        <!-- <td v-if="getActionId() === 1">{{ props.item.class }}</td>
        <td v-if="getActionId() === 1">{{ props.item.students }}</td>-->
        <!-- <td v-if="getActionId() === 2">{{ props.item.count_attendence }}</td>
        <td v-if="getActionId() === 2">{{ props.item.people_dp }}</td>
        <td v-if="getActionId() === 2">{{ props.item.count_dp }}</td>
        <td v-if="getActionId() === 3">{{ props.item.count_add }}</td>
        <td v-if="getActionId() === 3">{{ props.item.count_cancel }}</td>
        <td v-if="getActionId() === 3">{{ props.item.count_packages }}</td>-->
        <td class="justify-center layout px-0">
          <Tbtn
            :tooltip-text="'Edit'"
            icon-mode
            flat
            color="primary"
            icon="edit"
            @onClick="getEdit(props.item)"
          />
          <Tbtn
            :tooltip-text="'Hapus'"
            icon-mode
            flat
            color="primary"
            icon="delete"
            @onClick="showConfirm(props.item)"
          />
        </td>
      </template>
    </v-data-table>
    <Dialog
      :show-dialog="showDialog"
      text="Yakin mau menghapus ?"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
    <year-form
      :show="showForm"
      :target-id="targetId"
      :is-edit="isEdit"
      :data-to-edit="dataToEdit"
      @onClose="closeDForm"
      @onAdd="addData"
      @onEdit="editData"
    />
  </div>
</template>

<script>
import { TARGET_YEARS } from "~/utils/apis"
import catchError, { showNoty } from "~/utils/catchError"
import axios from "axios"
import { global } from "~/mixins"
import _ from "lodash"
import Dialog from "~/components/Dialog"
import yearForm from "./yearForm"

export default {
  components: { Dialog, yearForm },
  mixins: [global],
  data() {
    return {
      headers: [
        { text: "Angkatan", align: "left", value: "year" },
        { text: "Jumlah Kelas", align: "left", value: "class" },
        {
          text: "Total Siswa",
          align: "left",
          value: "students"
        },
        { text: "Aksi", value: "", align: "center", sortable: false }
      ],
      headers2: [
        { text: "Angkatan", align: "left", value: "year" },
        {
          text: "Jumlah Hadir",
          align: "left",
          value: "count_attendence"
        },
        { text: "Jumlah Orang DP", align: "left", value: "people_dp" },
        { text: "Total DP Diterima", align: "left", value: "count_dp" },
        { text: "Aksi", value: "", align: "center", sortable: false }
      ],
      headers3: [
        { text: "Angkatan", align: "left", value: "year" },
        { text: "Jumlah Tambah", align: "left", value: "count_add" },
        { text: "Jumlah Batal", align: "left", value: "count_cancel" },
        {
          text: "Jumlah Bagi Paket",
          align: "left",
          value: "count_packages"
        },
        { text: "Aksi", value: "", align: "center", sortable: false }
      ],
      items: [],
      showDialog: false,
      dataToDelete: null,
      showForm: false,
      dataToEdit: null,
      isEdit: false
    }
  },
  computed: {
    targetId() {
      return this.$route.params ? this.$route.params.id.toString() : ""
    },
    getHeaders() {
      if (
        this.currentEdit &&
        this.currentEdit.schedulle &&
        this.currentEdit.schedulle.action
      ) {
        let actionId = this.currentEdit.schedulle.action.id
        switch (actionId) {
          case 1:
            return this.headers
          case 2:
            return this.headers
          case 3:
            return this.headers
          default:
            return null
        }
      }
      return null
    }
  },
  watch: {
    pagination: {
      handler: _.debounce(function() {
        this.pupulateTable()
      }, 500),
      deep: true
    }
  },
  mounted() {
    this.pupulateTable()
  },
  methods: {
    async pupulateTable() {
      try {
        this.activateLoader()
        this.loading = true

        const { descending, sortBy } = this.pagination
        const endPoint = `${TARGET_YEARS}?${this.getQueryParams()}&marketing_target_id=${this.getTargetId(
          this.currentEdit
        )}`

        const res = await axios.get(endPoint).then(res => res.data)
        this.items = res.data
        this.totalItems = res.meta.total
        if (sortBy) {
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
        console.log(e)

        this.loading = false
        this.showForm = false
        this.deactivateLoader()
        catchError(e)
      }
    },
    getActionId() {
      if (
        this.currentEdit &&
        this.currentEdit.schedulle &&
        this.currentEdit.schedulle.action
      )
        return this.currentEdit.schedulle.action.id
      else null
    },
    getTargetId(data) {
      return data.schedulle && data.schedulle.target
        ? data.schedulle.target.id
        : null
    },
    showConfirm(data) {
      this.showDialog = true
      this.dataToDelete = data
    },
    closeDForm() {
      this.showForm = false
      this.isEdit = false
      this.dataToEdit = null
      this.dataToDelete = null
    },
    addData(data) {
      this.items.unshift(data)
      this.closeDForm()
    },
    editData(data) {
      let index = _.findIndex(this.items, { id: data.id })
      this.items.splice(index, 1, data)
      this.closeDForm()
    },
    getEdit(data) {
      this.dataToEdit = data
      this.isEdit = true
    },
    removeData() {
      try {
        this.activateLoader()
        axios.delete(TARGET_YEARS + "/" + this.dataToDelete.id).then(resp => {
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

<style scoped></style>
