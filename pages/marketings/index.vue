<template>
  <v-card>
    <v-card-title class="primary--text">
      {{ title }}
    </v-card-title>
    <v-toolbar flat color="transparent">
      <Tbtn
        v-if="checkPermission('create-marketing')"
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
        :options.sync="options"
        :footer-props="footerProps"
        :server-items-length="total"
      >
        <template v-slot:item.name="{ item }">
          <v-btn text color="primary" nuxt :to="`${link}/${item.id}`">
            {{ item.name }}
          </v-btn>
        </template>
        <template v-slot:item.is_active="{ item }">
          <span v-if="item.is_active">
            <v-chip color="green" text-color="white">Active</v-chip>
          </span>
          <span v-else>
            <v-chip>Not Active</v-chip>
          </span>
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
      model="Marketing"
      @onClose="showDownloadDialog = false"
    />
  </v-card>
</template>

<script>
import debounce from "lodash/debounce"
import { headers, downloadData } from "~/components/marketings/util"
import { global, catchError } from "~/mixins"
import { dform } from "~/components/marketings"
import DownloadDialog from "~/components/DownloadDialog"
export default {
  components: { DownloadDialog, dform },
  mixins: [global, catchError],
  data() {
    return {
      title: "Marketing",
      link: "/marketings",
      headers: headers,
      fillable: downloadData,
      typeDates: ["created_at"],
      dataToExport: []
    }
  },
  computed: {
    supervisorId() {
      if (this.user && this.user.roles) {
        const role = this.user.roles[0].slug
        if (role === "supervisor") {
          return this.user.id
        }
      }
      return ""
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
        if (this.supervisorId !== "") {
          queries += `supervisor_id=${this.supervisorId}`
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
      this.dataToExport = this.items
      if (this.dataToExport.length) {
        this.showDownloadDialog = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
