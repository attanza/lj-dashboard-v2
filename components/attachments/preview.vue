<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline primary--text">
            {{ formTitle }}
          </span>
        </v-card-title>
        <v-img v-if="url != ''" :src="url" aspect-ratio="1.7" />

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click.native="onClose">
            Tutup
          </v-btn>
          <v-btn v-if="url != ''" :href="url" color="primary" target="_blank">
            Tampilkan file asli
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global } from "~/mixins"

export default {
  $_veeValidate: {
    validator: "new"
  },
  mixins: [global],
  props: {
    show: {
      type: Boolean,
      required: true
    },
    url: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      dialog: false,
      formTitle: "Preview"
    }
  },
  watch: {
    show() {
      this.dialog = this.show
    }
  },
  methods: {
    onClose() {
      this.dialog = false
      this.$emit("onClose")
    },
    submit() {
      console.log("submit")
    }
  }
}
</script>
