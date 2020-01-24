import axios from "axios";
import { ExportToCsv } from "export-to-csv";
import { mapState } from "vuex";
import Noty from "~/components/Noty";
import Tbtn from "~/components/Tbtn";

export default {
  components: { Noty, Tbtn },
  data() {
    return {
      loading: false,
      showForm: false,
      totalItems: 0,
      search: "",
      rowsPerPage: [10, 25, 50, 100],
      pagination: {
        sortBy: "",
        descending: false,
        page: 1,
        limit: 10,
        rowsPerPage: 10,
        search: null,
        search_by: null,
        search_query: null,
        between_date: null,
        start_date: null,
        end_date: null,
        sort_by: null,
        sort_mode: null
      },
      showDownloadDialog: false
    };
  },
  mounted() {
    this.setAuth();
  },

  methods: {
    inArray(keys, searchedKey) {
      let result = false;
      for (let i in keys) {
        if (keys[i] === searchedKey) {
          result = true;
        }
      }
      return result;
    },
    setCase(txt) {
      return this.$changeCase.titleCase(txt);
    },
    setSnakeCase(txt) {
      return this.$changeCase.snakeCase(txt);
    },
    setAuth() {
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        axios.defaults.headers.post["Content-Type"] = "application/json";
      }
    },
    activateLoader() {
      this.$bus.$emit("activate_loader");
    },
    deactivateLoader() {
      this.$bus.$emit("deactivate_loader");
    },

    csvExport(title, data) {
      const options = {
        filename: title,
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalseparator: ".",
        showLabels: true,
        showTitle: true,
        title: title,
        useBom: true,
        useKeysAsHeaders: true
      };

      if (data.length) {
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(data);
      }
    },
    getQueryParams() {
      let query = "";
      this.pagination.limit = this.pagination.rowsPerPage;
      for (let key in this.pagination) {
        if (
          this.pagination.hasOwnProperty(key) &&
          this.pagination[key] != null
        ) {
          query += `${key}=${this.pagination[key]}&`;
        }
      }
      return query;
    },
    resetPagination() {
      this.pagination = {
        sortBy: "",
        descending: false,
        search: null,
        search_by: null,
        search_query: null,
        between_date: null,
        start_date: null,
        end_date: null,
        sort_by: null,
        sort_mode: null
      };
    },
    clearStore() {
      this.$store.commit("currentEdit", null);
      this.$store.commit("currentEdit2", null);
      this.$store.commit("comboData", null);
      this.$store.commit("comboData2", null);
      this.$store.commit("universityId", null);
      this.$store.commit("studyId", null);
      this.$store.commit("targetId", null);
      this.$store.commit("schedulleId", null);
    }
  },
  computed: {
    ...mapState([
      "token",
      "currentEdit",
      "comboData",
      "comboData2",
      "comboData3",
      "permissions",
      "user",
      "dashboardData",
      "universityId",
      "studyId",
      "targetId",
      "schedulleId"
    ])
  }
};
