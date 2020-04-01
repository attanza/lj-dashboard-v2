<template>
  <ValidationObserver ref="observer">
    <form>
      <v-card flat>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <ValidationProvider
                v-slot="{ errors }"
                name="oldPassword"
                rules="required"
              >
                <v-text-field
                  v-model="oldPassword"
                  :error-messages="errors"
                  label="Password Lama"
                  :type="show1 ? 'text' : 'password'"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show1 = !show1"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="12">
              <ValidationProvider
                v-slot="{ errors }"
                name="password"
                rules="required|min:6"
              >
                <v-text-field
                  ref="password"
                  v-model="password"
                  :error-messages="errors"
                  label="Password Baru"
                  :type="show2 ? 'text' : 'password'"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show2 = !show2"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="12">
              <ValidationProvider
                v-slot="{ errors }"
                name="passwordConfirmation"
                rules="required|confirmed:password"
              >
                <v-text-field
                  v-model="passwordConfirmation"
                  :error-messages="errors"
                  label="Konfirmasi Password"
                  :type="show3 ? 'text' : 'password'"
                  :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show3 = !show3"
                />
              </ValidationProvider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="submit">
            {{ messages.form.SAVE }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </form>
  </ValidationObserver>
</template>

<script>
import messages from "@/utils/messages"
import { global, catchError } from "~/mixins"

export default {
  mixins: [global, catchError],
  data() {
    return {
      messages: messages,
      show1: false,
      show2: false,
      show3: false,
      oldPassword: "",
      password: "",
      passwordConfirmation: ""
    }
  },
  methods: {
    async submit() {
      if (await this.$refs.observer.validate()) {
        this.changePassword()
      }
      return
    },
    async changePassword() {
      try {
        this.activateLoader()
        await this.$axios.$put(
          `/profile/${this.auth.user.id}/change-password`,
          {
            old_password: this.oldPassword,
            password: this.password,
            password_confirmation: this.passwordConfirmation
          }
        )
        this.$refs.observer.reset()
        this.showNoty("Password Updated", "success")
        this.clearData()
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.catchError(e)
      }
    },
    clearData() {
      this.oldPassword = ""
      this.password = ""
      this.passwordConfirmation = ""
    }
  }
}
</script>
