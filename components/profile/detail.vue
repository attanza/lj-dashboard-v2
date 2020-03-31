<template>
  <div>
    <v-card flat>
      <v-container grid-list-md fluid style="padding: 0px;">
        <v-card-text>
          <sharedForm
            :items="formItem"
            :show-button="true"
            :init-value="auth.user"
            @onSubmit="editData"
          />
        </v-card-text>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { global, catchError } from "~/mixins"
import sharedForm from "../sharedForm"
import { formItem } from "./util"

export default {
  components: { sharedForm },
  mixins: [global, catchError],
  data() {
    return {
      link: "/profile",
      formItem: formItem
    }
  },

  methods: {
    async editData(data) {
      try {
        if (this.auth.user) {
          this.activateLoader()
          const resp = await this.$axios.$put(
            this.link + "/" + this.auth.user.id,
            data
          )
          this.$store.commit("user", resp.data)
          this.showNoty(this.$messages.form.UPDATED, "success")
          this.deactivateLoader()
        }
      } catch (e) {
        this.deactivateLoader()
        this.catchError(e)
      }
    }
  }
}
</script>
