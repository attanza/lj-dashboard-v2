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
            v-if="checkPermission('delete-schedulle')"
            color="primary"
            icon="delete"
            icon-mode
            tooltip-text="Hapus"
            @onClick="confirmDelete"
          />
        </v-toolbar>
        <v-card-text>
          <sharedForm
            :items="formItem"
            :show-button="checkPermission('update-schedulle')"
            :init-value="initVal"
            @onSubmit="editData"
          ></sharedForm>
        </v-card-text>
      </v-container>
    </v-card>
    <Dialog
      :showDialog="showDialog"
      :text="$messages.general.CONFIRM_DELETE"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
  </div>
</template>

<script>
import { global, catchError } from "~/mixins";
import Dialog from "~/components/Dialog";
import sharedForm from "../sharedForm";
import { formItem } from "./util";

export default {
  components: { Dialog, sharedForm },
  mixins: [global, catchError],
  data() {
    return {
      link: "/schedulles",
      formItem: formItem,
      showDialog: false,
      initVal: {}
    };
  },

  mounted() {
    this.populateTarget();
    this.populateMarketing();
    this.populateAction();
    this.setInitValue();
  },

  methods: {
    toHome() {
      this.$router.go(-1);
    },

    setInitValue() {
      if (this.currentEdit) {
        this.initVal = {};
        formItem.map(f => {
          this.initVal[f.value] = this.currentEdit[f.value];
        });
        const date = this.currentEdit.date.split(" ")[0];
        const time = this.currentEdit.date.split(" ")[1];
        this.initVal.date = date;
        this.initVal.time = time;
      }
    },

    async populateTarget() {
      try {
        const resp = await this.$axios.$get(
          "/combo-data?model=MarketingTarget"
        );
        const targetData = resp.map(r => ({ id: r.id, name: r.code }));
        const idx = this.formItem.findIndex(
          f => f.value === "marketing_target_id"
        );
        if (idx !== -1) {
          this.formItem[idx].items = targetData;
        }
      } catch (e) {
        this.catchError(e);
      }
    },
    async populateMarketing() {
      try {
        const resp = await this.$axios.$get("/combo-data?model=Marketing");
        const idx = this.formItem.findIndex(f => f.value === "marketing_id");
        if (idx !== -1) {
          this.formItem[idx].items = resp;
        }
      } catch (e) {
        this.catchError(e);
      }
    },
    async populateAction() {
      try {
        const resp = await this.$axios.$get("/combo-data?model=Action");
        const idx = this.formItem.findIndex(
          f => f.value === "marketing_action_id"
        );
        if (idx !== -1) {
          this.formItem[idx].items = resp;
        }
      } catch (e) {
        this.catchError(e);
      }
    },

    async editData(data) {
      try {
        this.activateLoader();
        if (this.currentEdit) {
          const resp = await this.$axios.$put(
            this.link + "/" + this.currentEdit.id,
            data
          );
          this.$store.commit("currentEdit", resp.data);
          this.showNoty(this.$messages.form.UPDATED, "success");
          this.deactivateLoader();
        }
      } catch (e) {
        this.deactivateLoader();
        this.catchError(e);
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
            this.link + "/" + this.currentEdit.id
          );
          if (resp.meta.status === 200) {
            this.showNoty(this.$messages.form.DELETED, "success");
            this.$router.push(this.link);
          }
        }
        this.deactivateLoader();
      } catch (e) {
        this.deactivateLoader();
        this.showDialog = false;
        this.catchError(e);
      }
    }
  }
};
</script>
