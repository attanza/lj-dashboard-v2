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
            v-if="checkPermission('delete-marketing-target')"
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
            :show-button="checkPermission('update-marketing-target')"
            :init-value="initValue"
            @onSubmit="editData"
          />
        </v-card-text>
      </v-container>
    </v-card>
    <Dialog
      :show-dialog="showDialog"
      :text="$messages.general.CONFIRM_DELETE"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
  </div>
</template>

<script>
import { global, catchError } from "~/mixins"
import Dialog from "~/components/Dialog"
import sharedForm from "../sharedForm"
import { formItem } from "./util"

export default {
  components: { Dialog, sharedForm },
  mixins: [global, catchError],
  data() {
    return {
      link: "/marketing-targets",
      formItem: formItem,
      showDialog: false,
      initValue: null
    }
  },

  mounted() {
    this.populateFormItem()

    this.populateUniversity()
  },

  methods: {
    toHome() {
      this.$router.go(-1)
    },

    populateFormItem() {
      let initValue = Object.assign({}, this.currentEdit)
      initValue.university_id = initValue.study.university.id
      delete initValue["study"]
      this.initValue = initValue
      this.populateStudyPrograms(initValue.university_id)
    },

    async populateUniversity() {
      try {
        const resp = await this.$axios.$get("/combo-data?model=University")
        const idx = this.formItem.findIndex(f => f.value === "university_id")

        if (idx !== -1) {
          this.formItem[idx].items = resp
        }
      } catch (e) {
        this.catchError(e)
      }
    },

    async populateStudyPrograms(universityId) {
      try {
        const resp = await this.$axios.$get(
          `/combo-data?model=StudyProgram&university_id=${universityId}`
        )
        const idx = this.formItem.findIndex(f => f.value === "study_program_id")

        if (idx !== -1) {
          this.formItem[idx].items = resp
        }
      } catch (e) {
        this.catchError(e)
      }
    },

    async editData(data) {
      try {
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await this.$axios.$put(
            this.link + "/" + this.currentEdit.id,
            data
          )
          this.$store.commit("currentEdit", resp.data)
          this.showNoty(this.$messages.form.UPDATED, "success")
          this.populateFormItem()
          this.deactivateLoader()
        }
      } catch (e) {
        this.deactivateLoader()
        this.catchError(e)
      }
    },
    confirmDelete() {
      this.showDialog = !this.showDialog
    },
    async removeData() {
      try {
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await this.$axios.$delete(
            this.link + "/" + this.currentEdit.id
          )
          if (resp.meta.status === 200) {
            this.showNoty(this.$messages.form.DELETED, "success")
            this.$router.push("/targets")
          }
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.showDialog = false
        this.catchError(e)
      }
    }
  }
}
</script>
