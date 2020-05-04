<template>
  <div>
    <v-card flat>
      <v-container fluid>
        <v-toolbar color="transparent" flat>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Cari"
            single-line
            hide-details
            clearable
          />
          <v-spacer />
          <Tbtn
            color="primary"
            icon="chevron_left"
            icon-mode
            tooltip-text="Kembali"
            @onClick="toHome"
          />
          <Tbtn
            color="primary"
            icon="save"
            icon-mode
            tooltip-text="Simpan"
            @onClick="showDialog = true"
          />

          <Tbtn
            v-if="search == ''"
            color="primary"
            tooltip-text="Tandai semua"
            icon-mode
            icon="check_box"
            @onClick="selectAll"
          />
          <Tbtn
            v-if="search == ''"
            color="primary"
            tooltip-text="Tidak ditandai semua"
            icon-mode
            icon="check_box_outline_blank"
            @onClick="clearAll"
          />
        </v-toolbar>
        <v-card-text>
          <v-layout v-if="items" row wrap>
            <v-flex
              v-for="permission in items"
              :key="permission.id"
              md3
              sm4
              xs6
            >
              <v-checkbox
                v-model="permissionArray"
                :label="permission.name"
                :value="permission.id"
                color="primary"
              />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-container>
    </v-card>
    <Dialog
      :show-dialog="showDialog"
      text="Yakin menambah Permission ?"
      @onClose="showDialog = false"
      @onConfirmed="attachPermissions"
    />
  </div>
</template>

<script>
import { global, catchError } from "~/mixins"
import { ROLE_PERMISSIONS_URL } from "~/utils/apis"
import Dialog from "~/components/Dialog"
import debounce from "lodash/debounce"
export default {
  components: { Dialog },
  mixins: [global, catchError],
  data() {
    return {
      showDialog: false,
      permissionArray: [],
      search: "",
      items: []
    }
  },
  watch: {
    search() {
      if (this.search == null || this.search === "") {
        this.items = this.$store.getters.getPermissions("")
        this.setPermissionArray()
      } else {
        this.searchPermissions()
      }
    }
  },
  mounted() {
    this.items = this.$store.getters.getPermissions("")
    this.setPermissionArray()
  },
  methods: {
    toHome() {
      this.$router.push("/roles")
    },
    setPermissionArray() {
      if (this.permissions) {
        this.permissions.forEach(p => {
          this.permissionArray.push(p.id)
        })
      }
    },
    async attachPermissions() {
      try {
        this.activateLoader()
        let formData = {
          role_id: this.currentEdit.id,
          permissions: this.permissionArray
        }

        const resp = await this.$axios.$put(ROLE_PERMISSIONS_URL, formData)
        this.$store.commit("permissions", resp.data)
        this.showNoty("Data disimpan", "success")
        this.showDialog = false
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.catchError(e)
      }
    },
    selectAll() {
      if (this.items) {
        this.permissionArray = []
        this.items.forEach(c => {
          this.permissionArray.push(c.id)
        })
      }
    },
    clearAll() {
      this.permissionArray = []
    },
    searchPermissions: debounce(function() {
      let results = this.$store.getters.getPermissions(this.search)
      this.items = results
    }, 300)
  }
}
</script>
