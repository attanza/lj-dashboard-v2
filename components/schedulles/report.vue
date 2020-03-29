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
        v-if="items"
        :headers="headers"
        :items="items"
        :loading="loading"
        :pagination.sync="pagination"
        :total-items="totalItems"
        :rows-per-page-items="rowsPerPage"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.code }}</td>
          <td>{{ props.item.schedulle ? props.item.schedulle.code : "" }}</td>
          <td>
            {{
              props.item.schedulle && props.item.schedulle.marketing
                ? props.item.schedulle.marketing.name
                : ""
            }}
          </td>
          <td>{{ props.item.method }}</td>
          <td>{{ props.item.date | moment("DD MMM YYYY HH:mm:ss") }}</td>
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
    <dform :show="showForm" @onClose="onClose" @onAdd="addData" />
  </div>
</template>
<script>
import debounce from "lodash/debounce"
import { MARKETING_REPORTS_URL, COMBO_DATA_URL } from "~/utils/apis"
import { global } from "~/mixins"
import catchError from "~/utils/catchError"
import axios from "axios"
import { dform } from "~/components/marketing-reports"

export default {
  components: { dform },
  mixins: [global],
  data: () => ({
    title: "Laporan Marketing",
    headers: [
      { text: "Kode Laporan", align: "left", value: "code" },
      { text: "Kode Jadwal", align: "left", value: "schedulle.code" },
      {
        text: "Marketing",
        align: "left",
        value: "schedulle.marketing.name"
      },
      { text: "Metode", align: "left", value: "method" },
      { text: "Tanggal", align: "left", value: "date" },
      { text: "Aksi", value: "", align: "center", sortable: false }
    ],
    items: [],
    confirmMessage: "Yakin mau menghapus ?",
    showConfirm: false,
    showForm: false
  }),

  computed: {
    schedulleId() {
      return this.cuurentEdit ? this.currentEdit.id : ""
    }
  },

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
    // this.initStore()
  },

  methods: {
    async initStore() {
      let action = await axios.get(COMBO_DATA_URL + "Action")
      if (action) this.$store.commit("comboData", action.data)
      let marketing = await axios.get(COMBO_DATA_URL + "MarketingAll")
      if (marketing) this.$store.commit("comboData2", marketing.data)
    },
    searchQuery: debounce(function() {
      this.pupulateTable()
    }, 500),

    async pupulateTable() {
      try {
        this.activateLoader()
        const { descending, sortBy } = this.pagination
        const endPoint = `${MARKETING_REPORTS_URL}?${this.getQueryParams()}&schedulle_id=${
          this.schedulleId
        }`

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
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.showForm = false
        catchError(e, null, this.$router)
      }
    },
    toDetail(data) {
      this.$router.push(`/marketing-reports/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    onClose() {
      this.showForm = false
    }
  }
}
</script>
