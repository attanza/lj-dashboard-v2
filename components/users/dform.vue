<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">{{ formTitle }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container grid-list-md>
            <form>
              <v-layout row wrap>
                <v-flex v-for="(f, index) in fillable" :key="index" xs12>
                  <div v-if="!inArray(notIncluded, f.key)">
                    <label>{{ f.caption }}</label>
                    <v-text-field
                      v-validate="f.rules"
                      v-model="formData[f.key]"
                      :error-messages="errors.collect(f.key)"
                      :name="f.key"
                      :data-vv-name="f.key"
                      :data-vv-as="f.caption"
                    />
                  </div>
                  <div v-if="f.key == 'roles' && comboData">
                    <label>Role</label>
                    <v-autocomplete
                      v-validate="'required|numeric'"
                      :items="comboData"
                      :error-messages="errors.collect('roles')"
                      :data-vv-name="'roles'"
                      :data-vv-as="'Role'"
                      v-model="formData['roles']"
                      label="Select Roles"
                      single-line
                      item-text="name"
                      item-value="id"
                      multiple
                    />
                  </div>
                  <div v-if="f.key == 'is_active'">
                    <v-switch v-model="formData['is_active']" label="Status aktif" color="primary" />
                  </div>
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click.native="onClose">Tutup</v-btn>
          <v-btn color="primary" @click.native="submit">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global, catchError } from "~/mixins";
import { USER_URL, COMBO_DATA_URL } from "~/utils/apis";
export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global, catchError],
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
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
          key: "roles",
          caption: "Role",
          value: [],
          rules: "required|array"
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
      notIncluded: ["roles", "is_active"],
      formData: {},
      formTitle: "Tambah User"
    };
  },
  watch: {
    show() {
      this.dialog = this.show;
    }
  },
  created() {
    this.setAuth();
    this.getRoles();
    this.setFields();
  },
  methods: {
    onClose() {
      this.$emit("onClose");
    },
    async getRoles() {
      try {
        let roles = await this.$axios.$get(COMBO_DATA_URL + "Role");
        if (roles) this.$store.commit("comboData", roles);
      } catch (e) {
        this.catchError(e);
      }
    },
    setFields() {
      this.errors.clear();
      this.fillable.forEach(data => (this.formData[data.key] = data.value));
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.saveData();
          return;
        }
      });
    },
    async saveData() {
      try {
        this.activateLoader();
        const resp = await this.$axios.$post(USER_URL, this.formData);

        if (resp.meta.status === 201) {
          this.showNoty("Data disimpan", "success");
          this.$emit("onAdd", resp.data);
          this.setFields();
        }
        this.deactivateLoader();
      } catch (e) {
        this.dialog = false;
        this.deactivateLoader();
        this.catchError(e);
      }
    }
  }
};
</script>
