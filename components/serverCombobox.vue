<template>
  <div>
    <v-layout row>
      <v-dialog v-model="dialog" max-width="600px" scrollable>
        <template v-slot:activator="{ on }">
          <v-btn text color="primary" dark v-on="on">
            {{ label }}
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="primary--text headline">{{ label }}</span>
            <v-spacer />
            <v-text-field
              v-model="options.search"
              append-icon="search"
              label="Cari"
              single-line
              hide-details
            />
          </v-card-title>
          <v-divider />
          <v-data-table
            :headers="headers"
            :items="items"
            :search="options.search"
            :loading="loading"
            :options.sync="options"
            :footer-props="footerProps"
            :server-items-length="total"
            dense
          >
            <template v-slot:item.name="{ item }">
              <v-btn text color="primary" @click="select(item)">
                {{ item.name }}
              </v-btn>
            </template>
          </v-data-table>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="dialog = false">
              Tutup
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-row v-if="errorMessage !== ''">
      <div class="v-text-field__details ml-3">
        <div class="v-messages theme--light error--text" role="alert">
          <div class="v-messages__wrapper">
            <div class="v-messages__message">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
import { catchError, global } from "~/mixins"
import { debounce } from "lodash"
export default {
  mixins: [catchError, global],
  props: {
    label: {
      type: String,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    errorMessages: {
      type: Array,
      required: false,
      default: null
    }
  },
  data: () => ({
    dialog: false,
    formTitle: "Server Combobox",
    errorMessage: ""
  }),
  watch: {
    options: {
      handler: debounce(function() {
        if (!this.loading) {
          this.getData()
        }
      }, 500),
      deep: true
    },
    errorMessages() {
      if (this.errorMessages.length > 0) {
        this.errorMessage = this.errorMessages[0]
      }
    }
  },

  mounted() {
    this.options.sortBy = ["name"]
    this.options.sortDesc = [true]
    this.getData()
  },
  methods: {
    async getData() {
      try {
        this.loading = true
        const queries = this.getQueries()
        const resp = await this.$axios.$get(`${this.url + queries}`)
        this.items = resp.data
        this.total = resp.meta.total
        this.loading = false
      } catch (e) {
        this.loading = false
        this.catchError(e)
      }
    },
    select(data) {
      this.dialog = false
      this.$emit("onSelected", data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
