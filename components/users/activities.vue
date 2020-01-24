<template>
  <v-card flat>
    <v-toolbar flat color="transparent">
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
import { global, catchError } from "~/mixins";
import DownloadDialog from "~/components/DownloadDialog";
export default {
  mixins: [global, catchError],
  components: { DownloadDialog },
  data() {
    return {
      title: "Aktifitas",
      link: "/activities",
      headers: [
        { text: "IP Address", align: "left", value: "ip" },
        { text: "Browser", align: "left", value: "browser" },
        { text: "Activity", align: "left", value: "activity" },
        { text: "Created", align: "left", value: "created_at" }
        // { text: "Actions", value: "name", sortable: false }
      ],
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
        this.catchError(e, null, this.$router);
      }
    },
    toDetail(data) {
      this.$router.push(`/roles/${data.id}`);
    },
    addData(data) {
      this.items.unshift(data);
      this.showForm = false;
    },
    downloadData() {
      this.dataToExport = [];
      let localItems = this.items;
      localItems.map(i => {
        let user = "";
        let data = Object.assign({}, i);
        delete data.user;
        delete data.user_id;
        if (i.user) user = i.user.name;
        data.user = user;
        this.dataToExport.push(data);
      });
      if (this.dataToExport.length) {
        this.showDownloadDialog = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
