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
          <td>
            <a @click="toDetail(props.item)">{{ props.item.code }}</a>
          </td>
          <td>
            {{
              props.item.schedulle &&
                props.item.schedulle.target &&
                props.item.schedulle.target.study &&
              props.item.schedulle.target.study.university
                ? props.item.schedulle.target.study.university.name
                : ''
            }}
          </td>
          <td>
            {{
              props.item.schedulle &&
                props.item.schedulle.target &&
                props.item.schedulle.target.study &&
                props.item.schedulle.target.study.studyName
                ? props.item.schedulle.target.study.studyName.name
                : ''
            }}
          </td>
          <td>
            {{
              props.item.schedulle && props.item.schedulle.action
                ? props.item.schedulle.action.name
                : ''
            }}
          </td>
          <td>{{ props.item.result }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="getEdit(props.item)">
              <v-icon color="primary">
                edit
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
      @onClose="onClose"
      @onAdd="addData"
      @onEdit="editData"
    />
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import findIndex from 'lodash/findIndex'
import { MARKETING_REPORTS_URL } from '~/utils/apis'
import { global } from '~/mixins'
import catchError from '~/utils/catchError'
import axios from 'axios'
import dform from './dform'

export default {
  components: { dform },
  mixins: [global],
  data: () => ({
    title: 'Laporan Marketing',
    headers: [
      { text: 'Kode Laporan', align: 'left', value: 'code' },
      {
        text: 'Perguruan Tinggi',
        align: 'left',
        value: 'schedulle.target.study.university.name',
      },
      {
        text: 'Program Studi',
        align: 'left',
        value: 'schedulle.target.study.studyName.name',
      },
      { text: 'Aksi', align: 'left', value: 'schedulle.action.name' },
      { text: 'Hasil', align: 'left', value: 'result' },

      { text: 'Aksi', align: 'center', value: '', sortable: false },
    ],
    items: [],
    confirmMessage: 'Yakin mau menghapus ?',
    showConfirm: false,
    showForm: false,
    isEdit: false,
    dataToEdit: null,
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
        const endPoint = `${MARKETING_REPORTS_URL}?${this.getQueryParams()}schedulle_id=${this
          .schedulleId || ''}&marketing_target_id=${this.targetId ||
          ''}&university_id=${this.universityId || ''}`

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
    getEdit(data) {
      this.dataToEdit = data
      this.isEdit = true
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    editData(data) {
      let index = findIndex(this.items, { id: data.id })
      this.items.splice(index, 1, data)
      this.onClose()
    },
    onClose() {
      this.showForm = false
      this.dataToEdit = null
      this.isEdit = false
    },
  },
}
</script>
