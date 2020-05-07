<template>
  <v-card>
    <v-card-title class="primary--text">{{ title }}</v-card-title>
    <referralList></referralList>
  </v-card>
</template>

<script>
import referralList from "~/components/referrals/referralList"
export default {
  components: { referralList },
  data() {
    return {
      title: "Referral"
    }
  }
}
</script>

<style lang="scss" scoped></style>
