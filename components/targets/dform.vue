<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="primary--text headline">
            {{ formTitle }}
          </span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <sharedForm
            :items="formItem"
            :show-button="checkPermission('create-marketing-target')"
            :show-cancel="true"
            :init-value="initValue"
            @onClose="onClose"
            @onSubmit="saveData"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global, catchError } from "~/mixins"
import sharedForm from "../sharedForm"
import { formItem } from "./util"
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
      formTitle: "Tambah Target",
      initValue: {}
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    }
  },
  mounted() {
    this.generateCode()
    this.$bus.$on("university_id", val => {
      this.populateStudyPrograms(val)
    })
    this.populateUniversity()
  },

  methods: {
    generateCode() {
      const code = this.$moment().unix()
      this.initValue.code = code
    },
    async populateUniversity() {
      try {
        const resp = await this.$axios.$get("/combo-data?model=University")
        const idx = this.findIndex("university_id")

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
        const idx = this.findIndex("study_program_id")

        if (idx !== -1) {
          this.formItem[idx].items = resp
        }
      } catch (e) {
        this.catchError(e)
      }
    },

    onClose() {
      this.$emit("onClose")
    },
    async saveData(data) {
      try {
        this.activateLoader()
        const resp = await this.$axios.$post(this.link, data)
        this.showNoty(this.$messages.form.SAVED, "success")
        this.$emit("onAdd", resp.data)
        this.deactivateLoader()
      } catch (e) {
        this.dialog = false
        this.deactivateLoader()
        this.catchError(e)
      }
    },
    findIndex(key) {
      return this.formItem.findIndex(f => f.value === key)
    }
  }
}
</script>
