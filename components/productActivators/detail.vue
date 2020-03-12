<template>
  <div>
    <v-card flat>
      <v-container grid-list-md fluid style="padding: 0px;">
        <v-toolbar flat color="transparent">
          <v-spacer />
          <Tbtn
            color="primary"
            icon="chevron_left"
            icon-mode
            tooltip-text="Kembali"
            @onClick="toHome"
          />

          <Tbtn
            v-if="checkPermission('delete-product-activator')"
            color="primary"
            icon="delete"
            icon-mode
            tooltip-text="Hapus"
            @onClick="confirmDelete"
          />
        </v-toolbar>
        <v-card-text>
          <sharedForm
            :items="formItem"
            :show-button="checkPermission('update-product-activator')"
            :init-value="initValue"
            @onSubmit="editData"
          />
        </v-card-text>
      </v-container>
    </v-card>
    <Dialog
      :show-dialog="showDialog"
      :text="$messages.general.CONFIRM_DELETE"
      @onClose="showDialog = false"
      @onConfirmed="removeData"
    />
  </div>
</template>

<script>
import { global, catchError } from '~/mixins'
import Dialog from '~/components/Dialog'
import sharedForm from '../sharedForm'
import { formItem } from './util'

export default {
  components: { Dialog, sharedForm },
  mixins: [global, catchError],
  data() {
    return {
      link: '/product-activators',
      formItem: formItem,
      showDialog: false,
      initValue: {},
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    initForm() {
      this.initValue = Object.assign({}, this.currentEdit)
      if (this.initValue.order) {
        this.initValue.order_id = this.initValue.order.order_no
      }
    },
    toHome() {
      this.$router.go(-1)
    },

    async editData(data) {
      try {
        data.order_id = data.order.id
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await this.$axios.$put(
            this.link + '/' + this.currentEdit.id,
            data
          )
          this.$store.commit('currentEdit', resp.data)
          this.initForm()
          this.showNoty(this.$messages.form.UPDATED, 'success')
          this.deactivateLoader()
        }
      } catch (e) {
        this.deactivateLoader()
        this.catchError(e)
      }
    },
    confirmDelete() {
      this.showDialog = !this.showDialog
    },
    async removeData() {
      try {
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await this.$axios.$delete(
            this.link + '/' + this.currentEdit.id
          )
          if (resp.meta.status === 200) {
            this.showNoty(this.$messages.form.DELETED, 'success')
            this.$router.push(this.link)
          }
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.showDialog = false
        this.catchError(e)
      }
    },
  },
}
</script>
