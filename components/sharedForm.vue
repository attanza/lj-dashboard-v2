<template>
  <form>
    <v-container fluid>
      <v-row v-for="f in items" :key="f.value">
        <v-col v-if="f.inForm" :sm6="sm6">
          <v-text-field
            v-if="f.el === 'text'"
            v-model="formData[f.value]"
            v-validate="f.rules"
            :type="f.type"
            :error-messages="errors.collect(f.value)"
            :name="f.value"
            :data-vv-name="f.value"
            :data-vv-as="f.text"
            :label="f.text"
          />

          <v-switch
            v-if="f.el === 'switch'"
            v-model="formData[f.value]"
            v-validate="f.rules"
            :error-messages="errors.collect(f.value)"
            :name="f.value"
            :data-vv-name="f.value"
            :data-vv-as="f.text"
            :label="f.text"
            color="primary"
          />

          <v-autocomplete
            v-if="f.el === 'combobox'"
            v-model="formData[f.value]"
            :items="f.items"
            v-validate="f.rules"
            :error-messages="errors.collect(f.value)"
            :name="f.value"
            :data-vv-name="f.value"
            :data-vv-as="f.text"
            :label="f.text"
            item-text="name"
            item-value="id"
            color="primary"
            @change="comboChange(f.value, formData[f.value])"
          ></v-autocomplete>

          <v-menu
            v-if="f.el === 'date'"
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
                v-validate="f.rules"
                :type="f.type"
                :error-messages="errors.collect(f.value)"
                :name="f.value"
                :data-vv-name="f.value"
                :data-vv-as="f.text"
                :label="f.text"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData[f.value]"
              @input="dateMenu = false"
            ></v-date-picker>
          </v-menu>

          <v-menu
            v-if="f.el === 'time'"
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
                v-validate="f.rules"
                :type="f.type"
                :error-messages="errors.collect(f.value)"
                :name="f.value"
                :data-vv-name="f.value"
                :data-vv-as="f.text"
                :label="f.text"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-model="formData[f.value]"
              @input="timeMenu = false"
            ></v-time-picker>
          </v-menu>

          <v-textarea
            v-if="f.el === 'textarea'"
            v-model="formData[f.value]"
            v-validate="f.rules"
            :error-messages="errors.collect(f.value)"
            :name="f.value"
            :data-vv-name="f.value"
            :data-vv-as="f.text"
            :label="f.text"
          />

          <vue-editor
            v-if="f.el === 'editor'"
            v-model="formData[f.value]"
            v-validate="f.rules"
            :error-messages="errors.collect(f.value)"
            :name="f.value"
            :data-vv-name="f.value"
            :data-vv-as="f.text"
            :label="f.text"
          ></vue-editor>
        </v-col>
      </v-row>
    </v-container>
    <v-divider class="mb-3"></v-divider>
    <v-card-actions>
      <v-btn v-if="showCancel" @click="close">{{ messages.form.CANCEL }}</v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="showButton" color="primary" @click="submit">{{
        messages.form.SAVE
      }}</v-btn>
    </v-card-actions>
  </form>
</template>

<script>
import messages from "../utils/messages";
export default {
  $_veeValidate: {
    validator: "new"
  },

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
    };
  },

  watch: {
    initValue() {
      if (this.initValue) {
        this.assignInitValue();
      }
    }
  },

  mounted() {
    if (this.initValue) {
      this.assignInitValue();
    }
  },

  methods: {
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$emit("onSubmit", this.formData);
          this.formData = {};
        }
        return;
      });
    },
    close() {
      this.formData = {};
      this.$emit("onClose");
    },
    assignInitValue() {
      this.formData = Object.assign({}, this.initValue);
    },
    comboChange(key, value) {
      this.$bus.$emit(key, value);
    }
  }
};
</script>
