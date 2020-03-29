import { extend, ValidationObserver, ValidationProvider } from "vee-validate"
import { messages } from "vee-validate/dist/locale/id.json"
import * as rules from "vee-validate/dist/rules"
import Vue from "vue"

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  })
})

Vue.component("ValidationProvider", ValidationProvider)
Vue.component("ValidationObserver", ValidationObserver)
