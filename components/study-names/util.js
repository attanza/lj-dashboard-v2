export let headers = [
  { text: "Name", align: "left", value: "name" },
  { text: "Deskripsi", align: "left", value: "description" }
]

export const downloadData = ["id", "name", "description"]

export const formItem = [
  {
    text: "Nama",
    value: "name",
    rules: "required|max:50",
    el: "text",
    type: "text",
    inForm: true
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
