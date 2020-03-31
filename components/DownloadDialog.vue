<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="primary--text headline">
          {{ $messages.downloadDialog.TITLE }}
        </span>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-radio-group v-model="radios">
          <v-radio
            :label="$messages.downloadDialog.SEEN_ON_SCREEN"
            value="1"
            color="primary"
          />
          <v-radio
            v-if="customeActive"
            label="Custom"
            value="2"
            color="primary"
          />
        </v-radio-group>
        <v-row v-if="radios == '2'">
          <v-col cols="6">
            <label>Sort By</label>
            <v-autocomplete
              v-model="queryData.sort_by"
              :items="fillable"
              label="Select sort by"
              single-line
              cache-items
            />
          </v-col>
          <v-col cols="6">
            <label>Sort Mode</label>
            <v-autocomplete
              v-model="queryData.sort_mode"
              :items="sortModes"
              label="Select sort mode"
              single-line
              cache-items
            />
          </v-col>
          <v-col>
            <label>Limit</label>
            <v-text-field
              v-model="queryData.limit"
              name="limit"
              type="String"
            />
          </v-col>
          <v-col>
            <label>Date Range By</label>
            <v-autocomplete
              v-model="queryData.range_by"
              :items="typeDates"
              label="Select range date by"
              single-line
              cache-items
            />
          </v-col>
        </v-row>
        <v-row v-if="queryData.range_by != ''">
          <v-col cols="6">
            <label>Range Start</label>
            <v-menu
              v-model="menu_range_start"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="queryData.range_start"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="queryData.range_start"
                @input="menu_range_start = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <label>Range End</label>
            <v-menu
              v-model="menu_range_end"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="queryData.range_end"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="queryData.range_end"
                @input="menu_range_end = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="onClose">Batal</v-btn>
        <v-btn dark color="primary" @click="downloadData">Download</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { global } from "~/mixins"
import catchError, { showNoty } from "~/utils/catchError"
import moment from "moment"
import { DATA_EXPORT_URL } from "~/utils/apis"
export default {
  mixins: [global],
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    dataToExport: {
      type: Array,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    fillable: {
      type: Array,
      required: true
    },
    typeDates: {
      type: Array,
      required: true
    },
    query: {
      type: String,
      required: false,
      default: ""
    },
    customeActive: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dialog: false,
      radios: "1",
      sortModes: ["asc", "desc"],
      queryData: {
        sort_by: "",
        sort_mode: "asc",
        limit: "100",
        range_by: "",
        range_start: moment()
          .add(-1, "M")
          .format("YYYY-MM-DD")
          .toString(),
        range_end: moment()
          .add(1, "d")
          .format("YYYY-MM-DD")
          .toString()
      },
      menu_range_start: false,
      menu_range_end: false
    }
  },
  watch: {
    showDialog() {
      if (this.showDialog || !this.showDialog) {
        this.dialog = this.showDialog
      }
    }
  },
  methods: {
    onClose() {
      this.clearForm()
      this.$emit("onClose")
    },
    async downloadData() {
      if (this.radios === "1") {
        this.csvExport(this.model, this.dataToExport)
        this.onClose()
      } else if (this.radios === "2") {
        try {
          this.activateLoader()
          let query = ""
          for (let key in this.queryData) {
            query += `&${key}=${this.queryData[key]}`
          }
          if (this.query) {
            query += "&" + this.query
          }
          let resp = await this.$axios.$get(
            DATA_EXPORT_URL + "?model=" + this.model + query
          )

          if (resp.meta.status === 200 && resp.data && resp.data.length > 0) {
            this.csvExport(this.model, resp.data)
          } else {
            showNoty("No result found", "error")
          }
          this.onClose()
          this.deactivateLoader()
        } catch (e) {
          this.clearForm()
          this.deactivateLoader()
          catchError(e)
        }
      }
    },
    clearForm() {
      this.dialog = false
      this.radios = "1"
      this.sortModes = ["asc", "desc"]
      this.queryData = {
        sort_by: "",
        sort_mode: "asc",
        limit: "100",
        range_by: "",
        range_start: moment()
          .add(-1, "M")
          .format("YYYY-MM-DD"),
        range_end: moment().format("YYYY-MM-DD")
      }
      this.menu_range_start = false
      this.menu_range_end = false
    }
  }
}
</script>
