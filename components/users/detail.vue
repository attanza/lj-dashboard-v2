<template>
  <div>
    <v-card flat>
      <v-container grid-list-md fluid style="padding-top: 5px;">
        <v-toolbar color="transparent" flat>
          <v-spacer />
          <Tbtn
            color="primary"
            icon="chevron_left"
            icon-mode
            tooltip-text="Kembali"
            @onClick="toHome"
          />
          <Tbtn color="primary" icon="save" icon-mode tooltip-text="Simpan" @onClick="submit" />
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
        <form>
          <v-layout row wrap>
            <v-flex
              v-for="(f, index) in fillable"
              v-if="!inArray(['is_active', 'password', 'roles'], f.key)"
              :key="index"
              sm6
              xs12
            >
              <label>{{ f.caption }}</label>
              <v-text-field
                v-validate="f.rules"
                v-model="formData[f.key]"
                :error-messages="errors.collect(f.key)"
                :name="f.key"
                :data-vv-name="f.key"
                :data-vv-as="f.caption"
              />
            </v-flex>
            <v-flex sm6 xs12>
              <v-switch v-model="switch1" label="Aktif" color="primary" />
            </v-flex>
            <v-flex sm6 xs12>
              <Tbtn
                :bottom="true"
                tooltip-text="Reset password"
                text="Reset Password"
                color="primary"
                icon="vpn_key"
                @onClick="showReset = true"
              />
            </v-flex>
          </v-layout>
        </form>
      </v-container>
    </v-card>
    <reset-password-form :show="showReset" @onClose="showReset = false" />
    <Dialog
      :showDialog="showDialog"
      text="Yakin mau menghapus ?"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
  </div>
</template>

<script>
import { global, catchError } from "~/mixins";
import { USER_URL } from "~/utils/apis";
import Dialog from "~/components/Dialog";
import resetPasswordForm from "./resetPasswordForm";

export default {
  $_veeValidate: {
    validator: "new"
  },
  components: { Dialog, resetPasswordForm },
  mixins: [global, catchError],
  data() {
    return {
      fillable: [
        {
          key: "name",
          caption: "Nama",
          value: "",
          rules: "required|max:50"
        },
        {
          key: "email",
          caption: "Email",
          value: "",
          rules: "required|email"
        },
        {
          key: "phone",
          caption: "Telepon",
          value: "",
          rules: "required|max:30"
        },
        {
          key: "password",
          caption: "Password",
          value: "",
          rules: "required|min:6"
        },
        {
          key: "is_active",
          caption: "Status aktif",
          value: true,
          rules: "required|boolean"
        },
        {
          key: "address",
          caption: "Alamat",
          value: "",
          rules: "max:250"
        },
        {
          key: "description",
          caption: "Deskripsi",
          value: "",
          rules: "max:250"
        }
      ],

      formData: {},
      showDialog: false,
      switch1: false,
      roles: [],
      showReset: false
    };
  },
  watch: {
    switch1() {
      if (this.switch1 || !this.switch1) {
        this.formData.is_active = this.switch1;
      }
    }
  },
  created() {
    this.setFields();
  },
  methods: {
    toHome() {
      // this.$router.push("/users")
      this.$router.go(-1);
    },
    setFields() {
      this.errors.clear();
      if (this.currentEdit) {
        this.fillable.forEach(
          data => (this.formData[data.key] = this.currentEdit[data.key])
        );
        this.switch1 = this.formData.is_active;
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
          let roleIds = [];
          this.currentEdit.roles.map(role => roleIds.push(role.id));
          this.formData.roles = roleIds;
          const resp = await this.$axios
            .$put(USER_URL + "/" + this.currentEdit.id, this.formData)
            .then(res => res.data);
          this.$store.commit("currentEdit", resp.data);
          this.setFields();
          this.showNoty("Data diperbaharui", "success");
          this.deactivateLoader();
        }
      } catch (e) {
        this.deactivateLoader();

        this.catchError(e);
      }
    },
    confirmDelete() {
      this.showDialog = true;
    },
    async removeData() {
      try {
        this.activateLoader();

        if (this.currentEdit) {
          const resp = await this.$axios
            .$delete(USER_URL + "/" + this.currentEdit.id)
            .then(res => res.data);
          if (resp.meta.status === 200) {
            this.showNoty("Data dihapus", "success");
            this.$router.push("/users");
          }
        }
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();

        this.catchError(e);
      }
    }
  }
};
</script>
