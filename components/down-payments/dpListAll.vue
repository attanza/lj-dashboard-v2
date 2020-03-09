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
          <!-- <td>
            <v-checkbox
              :input-value="!!props.item.verified_at"
              :disabled="!!props.item.verified_at"
              hide-details
              color="primary"
              @change="editData(props.item)"
            />
          </td>-->
          <td>
            <a @click="toDetail(props.item)">{{ props.item.transaction_no }}</a>
          </td>
          <td>{{ props.item.target ? props.item.target.code : '' }}</td>
          <td>
            {{
              props.item.target &&
                props.item.target.study &&
              props.item.target.study.university
                ? props.item.target.study.university.name
                : ''
            }}
          </td>
          <td>
            {{
              props.item.target &&
                props.item.target.study &&
                props.item.target.study.studyName
                ? props.item.target.study.studyName.name
                : ''
            }}
          </td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.dp ? props.item.dp.toLocaleString('id') : 0 }}</td>
          <td>{{ props.item.kelas }}</td>
          <td>{{ props.item.produk }}</td>
          <td>
            {{ props.item.harga ? props.item.harga.toLocaleString('id') : 0 }}
          </td>
        </template>
      </v-data-table>
    </v-card>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData" />
    <DownloadDialog
      :show-dialog="showDownloadDialog"
      :data-to-export="dataToExport"
      :fillable="fillable"
      :type-dates="typeDates"
      model="Down Payments"
      @onClose="showDownloadDialog = false"
    />
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import findIndex from 'lodash/findIndex'
import { DP_URL } from '~/utils/apis'
import { global } from '~/mixins'
import dform from './dform'
import axios from 'axios'
import DownloadDialog from '~/components/DownloadDialog'
import catchError, { showNoty } from '~/utils/catchError'

export default {
  components: { dform, DownloadDialog },
  mixins: [global],
  data: () => ({
    title: 'Down Payment',
    headers: [
      // { text: "Verified", align: "left", value: "is_verified" },
      {
        text: 'Nomor Transaksi',
        align: 'left',
        value: 'transaction_no',
      },
      {
        text: 'Kode Target',
        align: 'left',
        value: 'marketing_target_id',
      },
      {
        text: 'Perguruan Tinggi',
        align: 'left',
        value: 'marketing_target_id',
      },
      {
        text: 'Study Program',
        align: 'left',
        value: 'marketing_target_id',
      },
      { text: 'Nama', align: 'left', value: 'name' },
      { text: 'Telepon', align: 'left', value: 'phone' },
      { text: 'DP', align: 'left', value: 'dp' },
      { text: 'Kelas', align: 'left', value: 'kelas' },
      { text: 'Produk', align: 'left', value: 'produk' },
      { text: 'Harga', align: 'left', value: 'harga' },
    ],
    items: [],
    confirmMessage: 'Yakin mau menghapus ?',
    showConfirm: false,
    dataToExport: [],
    fillable: [
      'id',
      'marketing_target_id',
      'name',
      'phone',
      'dp',
      'kelas',
      'produk',
      'harga',
    ],
    typeDates: ['created_at'],
    checkbox: false,
  }),

  watch: {
    pagination: {
      handler: debounce(function() {
        this.pupulateTable()
      }, 500),
      deep: true,
    },
  },

  mounted() {
    this.pupulateTable()
  },

  methods: {
    async pupulateTable() {
      try {
        this.activateLoader()
        const { descending, sortBy } = this.pagination
        const endPoint = `${DP_URL}?${this.getQueryParams()}&marketing_target_id=${this
          .targetId || ''}`
        console.log('targetId: ' + this.targetId)
        const res = await axios.get(endPoint).then(res => res.data)
        this.items = res.data
        this.totalItems = res.meta.total
        console.log('totalItems: ' + this.totalItems)
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
      this.$router.push(`/down-payments/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    downloadData() {
      this.dataToExport = []
      this.items.forEach(data => {
        let d = Object.assign({}, data)

        // Target Marketing
        delete d.target
        delete d.marketing_target_id
        if (data.target) d.target = data.target.code

        this.dataToExport.push(d)
      })
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    },
    async editData(data) {
      try {
        data.is_verified = true
        this.activateLoader()
        const resp = await axios
          .put(`${DP_URL}/${data.id}`, data)
          .then(res => res.data)
        if (resp.meta.status === 200) {
          let index = findIndex(this.items, item => item.id == data.id)
          this.items.splice(index, 1, resp.data)
          showNoty('Data diperbaharui', 'success')
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        catchError(e)
      }
    },
  },
}
</script>
