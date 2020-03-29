export const headers = [
  { text: "Permission", align: "left", value: "name" },
  { text: "Deskripsi", align: "left", value: "description" }
]

export const downloadData = ["id", "name", "slug", "description"]

export const formItem = [
  {
    text: "Permission",
    value: "name",
    el: "text",
    type: "text",
    rules: "required|max:50",
    inForm: true
  },

  {
    text: "Slug",
    value: "slug",
    el: "text",
    type: "text",
    rules: "required|max:50",
    inForm: false
  },

  {
    text: "Deskripsi",
    value: "description",
    el: "textarea",
    type: "text",
    rules: "max:250",
    inForm: true
  }
]
