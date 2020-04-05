import { ExportToCsv } from "export-to-csv"
import { includes } from "lodash"
import { mapState } from "vuex"
import Noty from "~/components/Noty"
import Tbtn from "~/components/Tbtn"
export default {
  components: { Noty, Tbtn },
  data() {
    return {
      loading: false,
      items: [],
      total: 1,
      search: "",
      options: {
        search: "",
        sortDesc: [true]
      },
      footerProps: {
        itemsPerPageOptions: [10, 25, 50, 100]
      },
      showDownloadDialog: false,
      showConfirm: false,

      showForm: false
    }
  },
  methods: {
    inArray(keys, searchedKey) {
      let result = false
      for (let i in keys) {
        if (keys[i] === searchedKey) {
          result = true
        }
      }
      return result
    },
    setCase(txt) {
      return this.$changeCase.titleCase(txt)
    },
    setSnakeCase(txt) {
      return this.$changeCase.snakeCase(txt)
    },
    activateLoader() {
      this.$bus.$emit("activate_loader")
    },
    deactivateLoader() {
      this.$bus.$emit("deactivate_loader")
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
      }

      if (data.length) {
        const csvExporter = new ExportToCsv(options)
        csvExporter.generateCsv(data)
      }
    },
    getQueries() {
      let query = "?"
      const sortBy =
        this.options.sortBy && this.options.sortBy[0]
          ? this.options.sortBy[0]
          : "created_at"
      const sortMode = this.options.sortDesc[0] ? "desc" : "asc"
      const queryString = {
        page: this.options.page || 1,
        limit: this.options.itemsPerPage,
        sort_by: sortBy,
        sort_mode: sortMode,
        category: this.options.category || ""
      }
      if (this.options.between_date) {
        queryString.between_date = this.options.between_date
      }
      if (this.options.start_date) {
        queryString.start_date = this.options.start_date
      }
      if (this.options.end_date) {
        queryString.end_date = this.options.end_date
      }
      const { search } = this.options
      if (search && search !== "") queryString.search = search
      Object.keys(queryString).map(q => (query += `${q}=${queryString[q]}&`))
      return query
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
      }
    },
    clearStore() {
      this.$store.commit("currentEdit", null)
    },
    checkPermission(permission) {
      return includes(this.userPermissions, permission)
    },
    /**
     * Normalize Nested Object to prevent error of in existence
     * @param {Object} data
     * @param {string} children
     */
    normalizeObject(data, children) {
      let lookup = Object.assign({}, data)
      const child = children.split(".")
      child.map(c => {
        lookup = lookup[c]
        if (!lookup) {
          return false
        }
      })
      return lookup
    },

    /**
     * Populate ComboData to be user in combo box
     * @param {string} comboDataLink {Api Combo Data endpoint, 'combo-data?model=Schedulle'}
     * @param {string} strValue {Object key to be used as value in combobox, eg; name | code}
     * @param {string} formItemKey {eg: schedulle_id, marketing_id, etc}
     * @param {integer} currentId {current id of dato to be edited}
     * @param {string} searchLink {Main API endpoint to get data by ID, eg: '/schedulles'}
     * @returns {void}
     */
    async populateComboData(
      comboDataLink,
      strValue,
      formItemKey,
      currentId = null,
      searchLink = null
    ) {
      try {
        const resp = await this.$axios.$get(comboDataLink)
        const comboData = resp.map(r => ({ id: r.id, name: r[strValue] }))
        if (comboData && comboData.length > 0) {
          if (currentId) {
            const currentDataToEdit = comboData.filter(
              data => data.id === currentId
            )
            if (currentDataToEdit.length === 0) {
              const resp2 = await this.$axios.$get(
                `/${searchLink}/${currentId}`
              )
              if (resp2 && resp2.data) {
                comboData.push({
                  id: resp2.data.id,
                  name: resp2.data[strValue]
                })
              }
            }
          }
          const idx = this.formItem.findIndex(f => f.value === formItemKey)
          if (idx !== -1) {
            this.formItem[idx].items = comboData
          }
        }
      } catch (e) {
        this.catchError(e)
      }
    }
  },
  computed: {
    ...mapState([
      "token",
      "currentEdit",
      "comboData",
      "permissions",
      "user",
      "dashboardData",
      "chartData",
      "auth"
    ]),
    userPermissions() {
      const permissions =
        this.$store.state.auth &&
        this.$store.state.auth.user &&
        this.$store.state.auth.user.roles
          ? this.$store.state.auth.user.roles[0].permissions
          : []
      let permissionArray = []
      permissions.map(p => permissionArray.push(p.slug))
      return permissionArray
    }
  }
}
