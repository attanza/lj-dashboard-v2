<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-toolbar-title style="margin-left: -10px;">
        Marketing
      </v-toolbar-title>
      <v-spacer />
      <Tbtn
        :bottom="true"
        tooltip-text="Kembali"
        icon-mode
        color="primary"
        icon="chevron_left"
        @onClick="toHome"
      />
      <Tbtn
        color="primary"
        icon="delete"
        icon-mode
        tooltip-text="Hapus"
        @onClick="confirmDelete"
      />
    </v-toolbar>
    <v-card>
      <v-card-text>
        <table class="table is-fullwidth">
          <tbody>
            <tr>
              <th width="30%">
                Nama
              </th>
              <td width="70%">
                {{
                  data.schedulle && data.schedulle.marketing
                    ? data.schedulle.marketing.name
                    : ""
                }}
              </td>
            </tr>
            <tr>
              <th>Action</th>
              <td>
                {{
                  data.schedulle && data.schedulle.action
                    ? data.schedulle.action.name
                    : ""
                }}
              </td>
            </tr>
            <tr>
              <th>Metode</th>
              <td>{{ data.method }}</td>
            </tr>
            <tr>
              <th>Hari/Tanggal</th>
              <td>{{ formatDate(data.date) }}</td>
            </tr>
            <tr>
              <th>Waktu</th>
              <td>{{ formatTime(data.date) }}</td>
            </tr>
            <tr>
              <th>Universitas</th>
              <td>
                {{
                  getStudyData(data) ? getStudyData(data).university.name : ""
                }}
              </td>
            </tr>
            <tr>
              <th>Program Studi</th>
              <td>
                {{
                  getStudyData(data) ? getStudyData(data).studyName.name : ""
                }}
              </td>
            </tr>

            <tr>
              <th>Alamat</th>
              <td>
                {{ getStudyData(data) ? getStudyData(data).address : "" }}
              </td>
            </tr>
            <tr>
              <th>Kota/Kabupaten</th>
              <td>
                {{
                  getStudyData(data) ? getStudyData(data).university.city : ""
                }}
              </td>
            </tr>
            <tr>
              <th>Provinsi</th>
              <td>
                {{
                  getStudyData(data)
                    ? getStudyData(data).university.province
                    : ""
                }}
              </td>
            </tr>
            <tr>
              <th>Telepon</th>
              <td>{{ getStudyData(data) ? getStudyData(data).phone : "" }}</td>
            </tr>
          </tbody>
        </table>
      </v-card-text>
    </v-card>
    <Dialog
      :show-dialog="showDialog"
      text="Yakin mau menghapus ?"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
  </div>
</template>

<script>
import moment from "moment"
import "moment/locale/id"
moment.locale("id")
import { global } from "~/mixins"
import Dialog from "~/components/Dialog"
import { MARKETING_REPORTS_URL } from "~/utils/apis"
import catchError, { showNoty } from "~/utils/catchError"
import axios from "axios"

export default {
  components: { Dialog },
  mixins: [global],
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDialog: false
    }
  },
  methods: {
    toHome() {
      this.$router.push("/marketing-reports")
      this.$router.go(-1)
    },
    formatDate(date) {
      return moment(date).format("dddd / D MMMM YYYY")
    },
    formatTime(date) {
      return moment(date).format("HH:mm")
    },
    getStudyData(data) {
      return data.schedulle &&
        data.schedulle.target &&
        data.schedulle.target.study
        ? data.schedulle.target.study
        : null
    },
    confirmDelete() {
      this.showDialog = false
      this.showDialog = true
    },
    async removeData() {
      try {
        if (this.currentEdit) {
          const resp = await axios
            .delete(MARKETING_REPORTS_URL + "/" + this.currentEdit.id)
            .then(res => res.data)
          if (resp.meta.status === 200) {
            showNoty("Data dihapus", "success")
            this.toHome()
          }
        }
      } catch (e) {
        catchError(e)
      }
    }
  }
}
</script>
