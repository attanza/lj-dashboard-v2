<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-toolbar flat color="transparent">
      <Tbtn
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
            {{
            item.name
            }}
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
    <dform :show="showForm" @onClose="showForm = false" @onAdd="addData" />
    <DownloadDialog
      :show-dialog="showDownloadDialog"
      :data-to-export="dataToExport"
      :fillable="fillable"
      :type-dates="typeDates"
      model="Role"
      @onClose="showDownloadDialog = false"
    />
  </v-card>
</template>

<script>
import debounce from "lodash/debounce";
import { headers } from "~/components/permissions/util";
import { global, catchError } from "~/mixins";
import { dform } from "~/components/permissions";
import DownloadDialog from "~/components/DownloadDialog";
export default {
  mixins: [global, catchError],
  components: { DownloadDialog, dform },
  data() {
    return {
      title: "Permission",
      link: "/permissions",
      headers: headers,
      confirmMessage: "Yakin mau menghapus ?",
      fillable: ["id", "name", "slug", "description"],
      typeDates: ["created_at"],
      dataToExport: []
    };
  },
  mounted() {
    this.populateTable();
  },
  watch: {
    options: {
      handler: debounce(function() {
        if (!this.loading) {
          this.populateTable();
        }
      }, 500),
      deep: true
    }
  },
  methods: {
    async populateTable() {
      try {
        this.activateLoader();
        const queries = this.getQueries();
        const resp = await this.$axios.$get(`${this.link + queries}`);
        this.total = resp.meta.total;
        this.items = resp.data;
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        this.showForm = false;
        this.catchError(e);
      }
    },
    toDetail(data) {
      this.$router.push(`${this.link}/${data.id}`);
    },
    addData(data) {
      this.items.unshift(data);
      this.showForm = false;
    },
    downloadData() {
      this.dataToExport = [];
      this.dataToExport = this.items;
      if (this.dataToExport.length) {
        this.showDownloadDialog = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
