<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn
          :color="color"
          :text="flat"
          :block="block"
          :outlined="outline"
          :icon="iconMode"
          :title="title"
          :tooltip-text="tooltipText"
          :dark="dark"
          v-on="on"
          @click="onClick"
        >
          <v-icon v-if="icon != ''">
            {{ icon }}
          </v-icon>
          <span v-if="title">{{ title }}</span>
        </v-btn>
      </template>
      <span v-if="tooltipText">{{ tooltipText }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false,
      default: ""
    },
    tooltipText: {
      type: String,
      required: false,
      default: ""
    },
    title: {
      type: String,
      required: false,
      default: ""
    },
    flat: {
      type: Boolean,
      required: false,
      default: false
    },
    block: {
      type: Boolean,
      required: false,
      default: false
    },
    outline: {
      type: Boolean,
      required: false,
      default: false
    },
    iconMode: {
      type: Boolean,
      required: false,
      default: false
    },
    dark: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    onClick() {
      this.$emit("onClick")
    }
  }
}
</script>

<style scoped></style>
