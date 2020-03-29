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
            v-if="checkPermission('delete-online-product-order')"
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
            :show-button="checkPermission('update-online-product-order')"
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
import { global, catchError } from "~/mixins"
import Dialog from "~/components/Dialog"
import sharedForm from "../sharedForm"
import { formItem, orderStatus } from "./util"

export default {
  components: { Dialog, sharedForm },
  mixins: [global, catchError],
  data() {
    return {
      link: "/online-product-orders",
      formItem: formItem,
      showDialog: false,
      orderStatus: orderStatus,
      initValue: {}
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    async initForm() {
      this.initValue = Object.assign({}, this.currentEdit)
      const marketingName = this.currentEdit.marketing
        ? this.currentEdit.marketing.name
        : ""
      this.initValue.marketing_id = marketingName
      // Order Status
      const statusIdx = this.formItem.findIndex(f => f.value === "status")
      this.formItem[statusIdx].items = this.orderStatus

      // Product
      const productsResponse = await this.$axios.$get(
        "/combo-data?model=Product"
      )
      if (productsResponse && productsResponse.length > 0) {
        const productIdx = this.formItem.findIndex(
          f => f.value === "product_id"
        )
        const products = productsResponse.map(p => ({
          id: p.id,
          name: p.code
        }))
        this.formItem[productIdx].items = products
      }

      // disable price
      const priceIdx = this.formItem.findIndex(f => f.value === "price")
      this.formItem[priceIdx].disabled = true
      // disable referral
      const referralIdx = this.formItem.findIndex(f => f.value === "referral")
      this.formItem[referralIdx].disabled = true
      // disable marketing
      const marketingIdx = this.formItem.findIndex(
        f => f.value === "marketing_id"
      )
      this.formItem[marketingIdx].disabled = true
    },
    toHome() {
      this.$router.go(-1)
    },

    async editData(data) {
      if (data.marketing_id === "") {
        data.marketing_id = undefined
      }
      try {
        this.activateLoader()
        if (this.currentEdit) {
          const resp = await this.$axios.$put(
            this.link + "/" + this.currentEdit.id,
            data
          )
          this.$store.commit("currentEdit", resp.data)
          this.showNoty(this.$messages.form.UPDATED, "success")
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
            this.link + "/" + this.currentEdit.id
          )
          if (resp.meta.status === 200) {
            this.showNoty(this.$messages.form.DELETED, "success")
            this.$router.push(this.link)
          }
        }
        this.deactivateLoader()
      } catch (e) {
        this.deactivateLoader()
        this.showDialog = false
        this.catchError(e)
      }
    }
  }
}
</script>
