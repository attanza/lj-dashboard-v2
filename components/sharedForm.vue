<template>
  <ValidationObserver ref="observer">
    <form>
      <v-container fluid>
        <v-row v-for="f in items" :key="f.value">
          <v-col v-if="f.inForm" :sm6="sm6">
            <ValidationProvider
              v-if="f.el == 'text'"
              v-slot="{ errors }"
              :name="f.text"
              :rules="f.rules"
            >
              <v-text-field
                v-model="formData[f.value]"
                :type="f.type"
                :error-messages="errors"
                :name="f.value"
                :label="f.text"
                :disabled="f.disabled"
              />
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el == 'switch'"
              v-slot="{ errors }"
              :name="f.text"
              :rules="f.rules"
            >
              <v-switch
                v-model="formData[f.value]"
                :error-messages="errors"
                :name="f.value"
                :label="f.text"
                color="primary"
              />
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el == 'combobox'"
              v-slot="{ errors }"
              :name="f.text"
              :rules="f.rules"
            >
              <v-autocomplete
                v-model="formData[f.value]"
                :items="f.items"
                :error-messages="errors"
                :name="f.value"
                :label="f.text"
                item-text="name"
                item-value="id"
                color="primary"
                @change="comboChange(f.value, formData[f.value])"
              />
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el == 'date'"
              v-slot="{ errors }"
              :name="f.text"
              :rules="f.rules"
            >
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formData[f.value]"
                    :type="f.type"
                    :error-messages="errors"
                    :name="f.value"
                    :label="f.text"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="formData[f.value]"
                  @input="dateMenu = false"
                />
              </v-menu>
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el == 'time'"
              v-slot="{ errors }"
              :name="f.text"
              :rules="f.rules"
            >
              <v-menu
                v-model="timeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formData[f.value]"
                    :type="f.type"
                    :error-messages="errors"
                    :name="f.value"
                    :label="f.text"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="formData[f.value]"
                  @input="timeMenu = false"
                />
              </v-menu>
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el == 'textarea'"
              v-slot="{ errors }"
              :name="f.text"
              :rules="f.rules"
            >
              <v-textarea
                v-model="formData[f.value]"
                :error-messages="errors"
                :name="f.value"
                :label="f.text"
              />
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el == 'editor'"
              v-slot="{ errors }"
              :name="f.text"
              :rules="f.rules"
            >
              <vue-editor
                v-model="formData[f.value]"
                :error-messages="errors"
                :name="f.value"
                :label="f.text"
              />
            </ValidationProvider>
          </v-col>
        </v-row>
      </v-container>
      <v-divider class="mb-3" />
      <v-card-actions>
        <v-btn v-if="showCancel" @click="close">
          {{ messages.form.CANCEL }}
        </v-btn>
        <v-spacer />
        <v-btn v-if="showButton" color="primary" @click="submit">
          {{ messages.form.SAVE }}
        </v-btn>
      </v-card-actions>
    </form>
  </ValidationObserver>
</template>

<script>
import messages from "../utils/messages"
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    initValue: {
      type: Object,
      required: false,
      default: null
    },
    showButton: {
      type: Boolean,
      required: false,
      default: false
    },
    sm6: {
      type: Boolean,
      required: false,
      default: false
    },
    showCancel: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      formData: {},
      messages: messages,
      dateMenu: false,
      timeMenu: false
    }
  },

  watch: {
    initValue() {
      if (this.initValue) {
        this.assignInitValue()
      }
    }
  },

  mounted() {
    if (this.initValue) {
      this.assignInitValue()
    }
  },

  methods: {
    async submit() {
      if (await this.$refs.observer.validate()) {
        this.$emit("onSubmit", this.formData)
      }
      return
    },
    close() {
      this.formData = {}

      this.$emit("onClose")
    },
    assignInitValue() {
      this.formData = Object.assign({}, this.initValue)
    },
    comboChange(key, value) {
      this.$bus.$emit(key, value)
    }
  }
}
</script>
