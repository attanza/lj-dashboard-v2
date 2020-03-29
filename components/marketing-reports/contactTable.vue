<template>
  <div class="mt-4">
    <h3 class="subheading ml-3">
      Contact Person
    </h3>
    <v-toolbar flat color="transparent">
      <Tbtn
        :bottom="true"
        tooltip-text="Tambah kontak"
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
      :headers="headers"
      :items="items"
      :loading="loading"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :rows-per-page-items="rowsPerPage"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.title }}</td>
        <td>{{ props.item.phone }}</td>
        <td>{{ props.item.email }}</td>
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
    <dform
      :show="showForm"
      :is-edit="isEdit"
      :data-to-edit="dataToEdit"
      @onClose="closeDForm"
      @onAdd="addData"
      @onEdit="editData"
    />
  </div>
</template>

<script>
import { CONTACT_URL } from "~/utils/apis"
import catchError, { showNoty } from "~/utils/catchError"
import axios from "axios"
import { global } from "~/mixins"
import _ from "lodash"
import Dialog from "~/components/Dialog"
import { dform } from "~/components/contacts"

export default {
  components: { Dialog, dform },
  mixins: [global],
  data() {
    return {
      headers: [
        { text: "Nama", align: "left", value: "name" },
        { text: "Jabatan", align: "left", value: "title" },
        { text: "Telepon", align: "left", value: "phone" },
        { text: "Email", align: "left", value: "email" },
        {
          text: "Aksi",
          value: "name",
          align: "center",
          sortable: false
        }
      ],
      items: [],
      showDialog: false,
      dataToDelete: null,
      showForm: false,
      dataToEdit: null,
      isEdit: false
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
        const endPoint = `${CONTACT_URL}?${this.getQueryParams()}&marketing_target_id=${this.getTargetId(
          this.currentEdit
        )}`

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
        this.showForm = false
        this.deactivateLoader()
        catchError(e)
      }
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
    showConfirm(data) {
      this.showDialog = true
      this.dataToDelete = data
    },
    getTargetId(data) {
      return data.schedulle && data.schedulle.target
        ? data.schedulle.target.id
        : ""
    },
    getEdit(data) {
      this.dataToEdit = data
      this.isEdit = true
    },
    removeData() {
      try {
        this.activateLoader()
        axios.delete(CONTACT_URL + "/" + this.dataToDelete.id).then(resp => {
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
