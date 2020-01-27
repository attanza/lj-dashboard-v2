import { ExportToCsv } from "export-to-csv";
import { includes } from "lodash";
import { mapState } from "vuex";
import Noty from "~/components/Noty";
import Tbtn from "~/components/Tbtn";
export default {
  components: { Noty, Tbtn },
  data() {
    return {
      loading: false,
      items: [],
      total: 1,
      search: "",
      options: {
        search: ""
      },
      footerProps: {
        itemsPerPageOptions: [10, 25, 50, 100]
      },
      showDownloadDialog: false,
      showConfirm: false,

      showForm: false
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
    getQueries() {
      let query = "?";
      const queryString = {
        page: this.options.page || 1,
        limit: this.options.itemsPerPage,
        sort_by: this.options.sortBy[0] || "created_at",
        sort_mode: this.options.sortDesc[0] ? "desc" : "asc",
        category: this.options.category || ""
      };
      const { search } = this.options;
      if (search && search !== "") queryString.search = search;
      Object.keys(queryString).map(q => (query += `${q}=${queryString[q]}&`));
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
    },
    checkPermission(permission) {
      return includes(this.userPermissions, permission);
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
      // "universityId",
      // "studyId",
      "targetId",
      "schedulleId"
    ]),
    userPermissions() {
      const permissions =
        this.$store.state.auth &&
        this.$store.state.auth.user &&
        this.$store.state.auth.user.roles
          ? this.$store.state.auth.user.roles[0].permissions
          : [];
      let permissionArray = [];
      permissions.map(p => permissionArray.push(p.slug));
      return permissionArray;
    }
  }
};
