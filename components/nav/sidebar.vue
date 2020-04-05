<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="/images/logo.png" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="title">
            Langsung Jalan
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list dense nav>
        <span v-for="(item, idx) in items" :key="idx">
          <v-list-group
            v-if="item.hasChild"
            :prepend-icon="item.icon"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-title v-text="item.title" />
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              nuxt
              :to="child.to"
            >
              <v-list-item-title v-text="child.title" />
              <v-list-item-icon>
                <v-icon v-text="child.icon" />
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else nuxt :to="item.to">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </span>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar flat fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-menu origin="center center" transition="scale-transition" bottom>
        <template v-slot:activator="{ on }">
          <v-btn text icon v-on="on">
            <v-avatar>
              <img :src="avatar" :alt="user.name" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item color="primary">
            <v-list-item-avatar>
              <v-img :src="avatar" aspect-ratio="1" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item
            v-for="(item, index) in righItems"
            :key="index"
            @click="itemActions(item.title)"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import { adminItems, supervisorItems } from "./menu"
export default {
  data() {
    return {
      clipped: false,
      drawer: true,
      items: null,
      mini: false,
      right: true,
      rightDrawer: false,
      title: "Langsung Jalan",
      righItems: [
        { title: "Profile", icon: "account_box" },
        { title: "Logout", icon: "exit_to_app" }
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    avatar() {
      if (this.user && this.user.photo != "") {
        return this.user.photo
      }
      return "/images/user.png"
    }
  },
  mounted() {
    this.getMenus()
  },
  methods: {
    getMenus() {
      if (this.user && this.user.roles) {
        const role = this.user.roles[0].slug
        switch (role) {
          case "super-administrator":
            this.items = adminItems
            break

          case "administrator":
            this.items = adminItems
            break

          case "supervisor":
            this.items = supervisorItems
            break

          default:
            this.items = null
            break
        }
      }
    },
    logout() {
      this.$auth.logout()
      // this.$router.push("/login")
      window.location.reload()
    },
    toProfile() {
      this.$router.push("/profile")
    },
    itemActions(title) {
      switch (title) {
        case "Logout":
          this.logout()
          break
        case "Profile":
          this.toProfile()
          break

        default:
          break
      }
    }
  }
}
</script>

<style scoped></style>
