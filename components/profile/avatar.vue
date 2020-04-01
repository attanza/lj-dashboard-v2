<template>
  <v-layout row class="mt-3">
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-img :src="avatar" aspect-ratio="1.7" />
        <v-card-text>
          <v-text-field
            v-model="imageName"
            label="Select Image"
            prepend-icon="attach_file"
            @click="pickFile"
          />
          <input
            ref="image"
            type="file"
            style="display: none"
            accept="image/*"
            @change="onFilePicked"
          />
          <Tbtn
            color="primary"
            block
            icon="cloud_upload"
            tooltip-text="Save profile picture"
            @onClick="submitFile"
          />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { global, catchError } from "~/mixins"

export default {
  mixins: [global, catchError],
  data() {
    return {
      imageName: "",
      imageUrl: "",
      imageFile: ""
    }
  },
  computed: {
    avatar() {
      if (this.auth.user.photo != "") {
        return this.auth.user.photo
      }
      return "/images/user.png"
    }
  },

  methods: {
    pickFile() {
      this.$refs.image.click()
    },

    onFilePicked(e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.imageName = files[0].name
        if (this.imageName.lastIndexOf(".") <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
        })
      } else {
        this.clearData()
      }
    },
    async submitFile() {
      try {
        this.activateLoader()
        if (this.imageFile != "") {
          let formData = new FormData()
          formData.append("photo", this.imageFile)
          const resp = await this.$axios
            .$post("/profile/upload/" + this.auth.user.id, formData, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
            .then(res => res.data)
          this.$store.commit("user", resp)
          this.showNoty("Profile Picture Updated", "success")
          this.clearData()
          this.deactivateLoader()
        }
      } catch (e) {
        this.deactivateLoader()
        this.catchError(e)
      }
    },
    clearData() {
      this.imageName = ""
      this.imageFile = ""
      this.imageUrl = ""
    }
  }
}
</script>
