<template>
  <div>
    <v-card flat>
      <v-container grid-list-md fluid style="padding: 0px;">
        <v-toolbar flat color="transparent">
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
            @onClick="submit"
          />
          <Tbtn
            color="primary"
            icon="refresh"
            icon-mode
            tooltip-text="Refresh"
            @onClick="setFields"
          />
          <Tbtn
            color="primary"
            icon="delete"
            icon-mode
            tooltip-text="Hapus"
            @onClick="confirmDelete"
          />
        </v-toolbar>
        <v-card-text>
          <form>
            <v-layout row wrap class="mt-3 px-2">
              <v-flex v-for="(f, index) in fillable" :key="index" sm6 xs12>
                <span v-if="f.key != 'description'">
                  <label>{{ f.caption }}</label>
                  <v-text-field
                    v-validate="f.rules"
                    v-model="formData[f.key]"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                  />
                </span>
                <span v-if="f.key == 'description'">
                  <label>{{ f.caption }}</label>
                  <v-textarea
                    v-validate="f.rules"
                    v-model="formData[f.key]"
                    :error-messages="errors.collect(f.key)"
                    :name="f.key"
                    :data-vv-name="f.key"
                  />
                </span>
              </v-flex>
            </v-layout>
          </form>
        </v-card-text>
      </v-container>
    </v-card>
    <Dialog
      :showDialog="showDialog"
      text="Yakin mau menghapus ?"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
  </div>
</template>

<script>
import { global } from "~/mixins";
import { ROLE_URL } from "~/utils/apis";
import Dialog from "~/components/Dialog";
import catchError, { showNoty } from "~/utils/catchError";

export default {
  $_veeValidate: {
    validator: "new"
  },
  components: { Dialog },
  mixins: [global],
  data() {
    return {
      fillable: [
        {
          key: "name",
          caption: "Role",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "description",
          caption: "Deskripsi",
          value: "",
          rules: "max:250"
        }
      ],
      formData: {},
      showDialog: false
    };
  },
  created() {
    this.setFields();
  },
  methods: {
    toHome() {
      // this.$router.push("/roles")
      this.$router.go(-1);
    },
    setFields() {
      this.errors.clear();
      if (this.currentEdit) {
        this.fillable.forEach(
          data => (this.formData[data.key] = this.currentEdit[data.key])
        );
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.editData();
          return;
        }
      });
    },
    async editData() {
      try {
        this.activateLoader();
        if (this.currentEdit) {
          const resp = await this.$axios.$put(
            ROLE_URL + "/" + this.currentEdit.id,
            this.formData
          );
          this.$store.commit("currentEdit", resp.data);
          this.setFields();
          showNoty("Data diperbaharui", "success");
          this.deactivateLoader();
        }
      } catch (e) {
        this.deactivateLoader();
        catchError(e);
      }
    },
    confirmDelete() {
      this.showDialog = !this.showDialog;
    },
    async removeData() {
      try {
        this.activateLoader();
        if (this.currentEdit) {
          const resp = await this.$axios.$delete(
            ROLE_URL + "/" + this.currentEdit.id
          );
          if (resp.meta.status === 200) {
            showNoty("Data dihapus", "success");
            this.$router.push("/roles");
          }
        }
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        this.showDialog = false;
        catchError(e);
      }
    }
  }
};
</script>
