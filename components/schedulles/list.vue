<template>
  <div>
    <v-toolbar flat color="transparent">
      <Tbtn
        v-if="checkPermission('create-schedulle')"
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
        :footer-props="footerProps"
        :server-items-length="total"
        :options.sync="options"
      >
        <template v-slot:item.code="{ item }">
          <v-btn text color="primary" nuxt :to="`${link}/${item.id}`">
            {{ item.code }}
          </v-btn>
        </template>

        <template v-slot:item.marketing_target_id="{ item }">
          {{ item.target ? item.target.code : "" }}
        </template>
        <template v-slot:item.marketing_id="{ item }">
          {{ item.marketing ? item.marketing.name : "" }}
        </template>
        <template v-slot:item.marketing_action_id="{ item }">
          {{ item.action ? item.action.name : "" }}
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
      model="Jadwal"
      @onClose="showDownloadDialog = false"
    />
  </div>
</template>

<script>
import debounce from "lodash/debounce"
import { headers, downloadData } from "./util"
import { global, catchError } from "~/mixins"
import dform from "./dform"
import DownloadDialog from "../DownloadDialog"
export default {
  components: { DownloadDialog, dform },
  mixins: [global, catchError],
  props: {
    targetId: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      title: "Jadwal",
      link: "/schedulles",
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
        if (this.targetId) {
          queries += `marketing_target_id=${this.targetId}&`
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
      this.$router.push(`${this.link}/${data.id}`)
    },
    addData(data) {
      this.items.unshift(data)
      this.showForm = false
    },
    downloadData() {
      this.dataToExport = []
      const notIncludes = [
        "marketing_target_id",
        "marketing_id",
        "marketing_action_id",
        "report"
      ]
      this.items.map(i => {
        const data = Object.assign({}, i)
        data.target = data.target.code
        data.marketing = data.marketing.name
        data.action = data.action.name
        notIncludes.map(n => delete data[n])
        this.dataToExport.push(data)
      })
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
