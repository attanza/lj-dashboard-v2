<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="6" md="6">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Langsung Jalan</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <ValidationObserver ref="observer">
                  <form>
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="email"
                      :rules="'required|email'"
                    >
                      <v-text-field
                        v-model="email"
                        :error-messages="errors"
                        name="email"
                        prepend-icon="email"
                        label="Alamat Email"
                        data-vv-name="email"
                      />
                    </ValidationProvider>

                    <ValidationProvider
                      v-slot="{ errors }"
                      v-model="password"
                      name="password"
                      :rules="'required'"
                    >
                      <v-text-field
                        v-model="password"
                        prepend-icon="lock"
                        :error-messages="errors"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        name="password"
                        label="Password"
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </ValidationProvider>
                  </form>
                </ValidationObserver>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :loading="loading"
                  :disabled="loading"
                  color="primary"
                  @click="submit"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { catchError } from "~/mixins"

export default {
  layout: "nonav",
  mixins: [catchError],
  data: () => ({
    email: "",
    password: "",
    show1: false,
    loading: false,
    allowedLogin: ["super-administrator", "administrator", "supervisor"]
  }),
  mounted() {
    this.fillEmailAndPassword()
  },
  methods: {
    fillEmailAndPassword() {
      const NODE_ENV = process.env.NODE_ENV
      if (NODE_ENV === "development") {
        this.email = "super_administrator@langsungjalan.com"
        this.password = "password"
      }
    },
    async submit() {
      if (await this.$refs.observer.validate()) {
        this.doLogin()
      }
      return
    },
    async doLogin() {
      try {
        this.loading = true
        await this.$auth.loginWith("local", {
          data: {
            email: this.email,
            password: this.password
          }
        })
        this.loading = false
        this.$router.push("/")
      } catch (e) {
        this.loading = false
        this.showNoty("Login Gagal", "error")
      }
    }
  }
}
</script>
