<template>
  <div>
    <v-card flat>
      <v-container fluid>
        <v-toolbar color="transparent" flat>
          <!-- <v-text-field
            v-model="search"
            append-icon="search"
            label="Cari"
            single-line
            hide-details
          />-->
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
            color="primary"
            tooltip-text="Tandai sama"
            icon-mode
            icon="check_box"
            @onClick="selectAll"
          />
          <Tbtn
            color="primary"
            tooltip-text="Tidak ditandai semua"
            icon-mode
            icon="check_box_outline_blank"
            @onClick="clearAll"
          />
        </v-toolbar>
        <v-card-text>
          <v-layout v-if="items" row wrap>
            <v-flex v-for="role in items" :key="role.id" md3 sm4 xs6>
              <v-checkbox
                v-model="rolesArray"
                :label="role.name"
                :value="role.id"
                color="primary"
              />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-container>
    </v-card>
    <Dialog
      :show-dialog="showDialog"
      text="Yakin akan diperbaharui ?"
      @onClose="showDialog = false"
      @onConfirmed="attachRoles"
    />
  </div>
</template>

<script>
import { global, catchError } from "~/mixins"
import { USER_URL } from "~/utils/apis"
import Dialog from "~/components/Dialog"
import debounce from "lodash/debounce"
export default {
  components: { Dialog },
  mixins: [global, catchError],
  data() {
    return {
      showDialog: false,
      search: "",
      items: [],
      rolesArray: []
    }
  },
  watch: {
    search() {
      if (this.search !== "") this.searchRoles()
    }
  },
  mounted() {
    this.items = this.$store.getters.getRoles("")
    this.setRoleArray()
  },
  methods: {
    toHome() {
      this.$router.push("/users")
    },
    setRoleArray() {
      if (this.currentEdit.roles) {
        this.currentEdit.roles.forEach(r => {
          this.rolesArray.push(r.id)
        })
      }
    },
    selectAll() {
      if (this.items) {
        this.rolesArray = []
        this.items.forEach(c => {
          this.rolesArray.push(c.id)
        })
      }
    },
    clearAll() {
      this.rolesArray = []
    },
    searchRoles: debounce(function() {
      let results = this.$store.getters.getRoles(this.search)
      this.items = results
    }, 300),
    async attachRoles() {
      try {
        this.activateLoader()

        let formData = {
          name: this.currentEdit.name,
          email: this.currentEdit.email,
          phone: this.currentEdit.phone,
          address: this.currentEdit.address,
          roles: this.rolesArray
        }
        const resp = await this.$axios.$put(
          USER_URL + "/" + this.currentEdit.id,
          formData
        )
        this.$store.commit("currentEdit", resp.data)
        this.showNoty("Data disimpan", "success")
        this.showDialog = false
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()

        this.catchError(e)
      }
    }
  }
}
</script>

<style scoped></style>
