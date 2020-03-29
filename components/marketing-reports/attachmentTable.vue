<template>
  <div class="mt-4">
    <h3 class="subheading ml-3">
      Lampiran
    </h3>
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
          <td>{{ props.item.target.code }}</td>
          <td>
            <v-avatar tile size="40" color="grey lighten-4">
              <img :src="props.item.url" :alt="props.item.caption" />
            </v-avatar>
          </td>
          <td>{{ props.item.caption }}</td>
          <td>{{ props.item.tags }}</td>
          <td class="justify-center layout px-0">
            <v-btn
              v-if="props.item.url && props.item.url != ''"
              icon
              class="mx-0"
              @click="showPreviewHandler(props.item)"
            >
              <v-icon color="primary">
                remove_red_eye
              </v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="prepareEdit(props.item)">
              <v-icon color="primary">
                edit
              </v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="prepareDelete(props.item)">
              <v-icon color="primary">
                delete
              </v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform
      :show="showForm"
      :is-edit="isEdit"
      :data-to-edit="dataToEdit"
      @onClose="formClose"
      @onAdd="addData"
      @onEdit="editData"
    />
    <preview :show="showPreview" :url="attachmentUrl" @onClose="closePreview" />
    <Dialog
      :show-dialog="showDialog"
      text="Yakin mau menghapus"
      @onClose="formClose"
      @onConfirmed="removeData"
    />
  </div>
</template>
<script>
import _ from "lodash"
import { ATTACHMENTS_URL } from "~/utils/apis"
import { global } from "~/mixins"
import { dform, preview } from "~/components/attachments"
import Dialog from "~/components/Dialog"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"

export default {
  middleware: "auth",
  components: { dform, preview, Dialog },
  mixins: [global],
  data: () => ({
    title: "Lampiran",
    headers: [
      { text: "Kode Target", align: "left", value: "target.code" },
      { text: "Preview", align: "left", value: "url" },
      { text: "Caption", align: "left", value: "caption" },
      { text: "Tags", align: "left", value: "tags" },
      { text: "Aksi", align: "center", value: "", sortable: false }
    ],
    items: [],
    confirmMessage: "Yakin mau menghapus ?",
    showConfirm: false,
    showPreview: false,
    dataToExport: [],
    fillable: ["id", "url", "caption", "tags"],
    typeDates: ["created_at"],
    attachmentUrl: "",
    isEdit: false,
    dataToEdit: null,
    showDialog: false
  }),

  computed: {
    targetId() {
      return this.$route.params ? this.$route.params.id.toString() : ""
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
        // const endPoint = `${ATTACHMENTS_URL}?${this.getQueryParams()}&marketing_target_id=${
        //   this.targetId
        // }`
        const endPoint = `${ATTACHMENTS_URL}?${this.getQueryParams()}&marketing_target_id=${this.getTargetId(
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
        this.deactivateLoader()
        catchError(e)
      }
    },
    showPreviewHandler(data) {
      this.attachmentUrl = data.url
      this.showPreview = true
    },
    closePreview() {
      this.attachmentUrl = ""
      this.showPreview = false
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    prepareEdit(data) {
      this.isEdit = true
      this.dataToEdit = data
      this.showForm = true
    },
    editData(data) {
      let index = _.findIndex(this.items, item => item.id == data.id)
      this.items.splice(index, 1, data)
      this.formClose()
    },
    formClose() {
      this.isEdit = false
      this.idToEdit = ""
      this.showForm = false
      this.showDialog = false
      this.dataToEdit = null
    },
    prepareDelete(data) {
      this.dataToEdit = data
      this.showDialog = true
    },
    getTargetId(data) {
      return data.schedulle && data.schedulle.target
        ? data.schedulle.target.id
        : null
    },
    removeData() {
      try {
        this.activateLoader()
        axios.delete(ATTACHMENTS_URL + "/" + this.dataToEdit.id).then(resp => {
          if (resp.status === 200) {
            let index = _.findIndex(
              this.items,
              item => item.id == this.dataToEdit.id
            )
            this.items.splice(index, 1)
            showNoty("Data dihapus", "success")
            this.showDialog = false
            this.dataToEdit = null
          }
        })
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },
    downloadData() {
      this.dataToExport = []
      this.items.forEach(data => {
        let d = Object.assign({}, data)

        // Target
        delete d.target
        delete d.marketing_target_id
        if (data.target) d.target = data.target.code

        this.dataToExport.push(d)
      })
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>
