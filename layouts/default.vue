<template>
  <v-app>
    <client-only>
      <sidebar />
      <v-content>
        <v-container fluid grid-list-lg>
          <nuxt />
        </v-container>
        <Loader />
      </v-content>
      <v-footer fixed app>
        <span>&copy; 2020</span>
      </v-footer>
    </client-only>
  </v-app>
</template>

<script>
import sidebar from "@/components/nav/sidebar"
import Loader from "@/components/Loader"
export default {
  middleware: "auth",
  components: { sidebar, Loader }
}
</script>
