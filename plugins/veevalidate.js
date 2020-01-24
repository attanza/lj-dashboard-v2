import Vue from "vue"
import VeeValidate, { Validator } from "vee-validate"
import id from "vee-validate/dist/locale/id"

Validator.localize("id", id)

Vue.use(VeeValidate)
