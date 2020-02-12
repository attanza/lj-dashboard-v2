<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="primary--text headline">{{ formTitle }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <sharedForm
            :items="formItem"
            @onClose="onClose"
            @onSubmit="saveData"
            :show-button="checkPermission('create-schedulle')"
            :show-cancel="true"
            :init-value="initValue"
          ></sharedForm>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global, catchError } from "~/mixins";
import sharedForm from "../sharedForm";
import { formItem } from "./util";
export default {
  components: { sharedForm },
  mixins: [global, catchError],
  props: {
    show: {
      type: Boolean,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      formItem: formItem,
      formTitle: "Tambah Jadwal",
      initValue: {}
    };
  },
  watch: {
    show() {
      this.dialog = this.show;
    }
  },

  mounted() {
    this.generateCode();

    this.populateTarget();
    this.populateMarketing();
    this.populateAction();
  },

  methods: {
    onClose() {
      this.$emit("onClose");
    },
    generateCode() {
      const code = this.$moment().unix();
      this.initValue.code = code;
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
    async saveData(data) {
      try {
        data.date = `${data.date} ${data.time}`;
        delete data["time"];
        this.activateLoader();
        const resp = await this.$axios.$post(this.link, data);
        this.showNoty(this.$messages.form.SAVED, "success");
        this.$emit("onAdd", resp.data);
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
