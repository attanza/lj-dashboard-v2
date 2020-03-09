<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="6" md="6">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <form>
                  <v-text-field
                    v-model="email"
                    v-validate="'required|email'"
                    :error-messages="errors.collect('email')"
                    name="email"
                    prepend-icon="email"
                    label="Alamat Email"
                    data-vv-name="email"
                  />

                  <v-text-field
                    v-model="password"
                    v-validate="'required'"
                    :append-icon="e1 ? 'visibility_off' : 'visibility'"
                    :type="e1 ? 'text' : 'password'"
                    :error-messages="errors.collect('password')"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    hint="At least 6 characters"
                    min="6"
                    @click:append="e1 = !e1"
                  />
                </form>
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
import { catchError } from '~/mixins'

export default {
  layout: 'nonav',
  $_veeValidate: {
    validator: 'new',
  },
  mixins: [catchError],
  data: () => ({
    email: 'super_administrator@langsungjalan.com',
    password: 'password',
    e1: false,
    loading: false,
    allowedLogin: ['super-administrator', 'administrator', 'supervisor'],
  }),
  methods: {
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.doLogin()
          return
        }
      })
    },
    async doLogin() {
      try {
        this.loading = true
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          },
        })
        this.loading = false
        this.$router.push('/')
      } catch (e) {
        this.loading = false
        this.showNoty('Login Gagal', 'error')
      }
    },
  },
}
</script>
