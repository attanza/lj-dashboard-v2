export let headers = [
  { text: "Nama Aksi", align: "left", value: "name" },
  { text: "Deskripsi", align: "left", value: "description" }
]

export const downloadData = ["id", "name", "description"]

export const formItem = [
  {
    value: "name",
    text: "Nama Aksi Kegiatan",
    rules: "required|max:50",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "description",
    text: "Deskripsi",
    rules: "max:250",
    el: "text",
    type: "text",
    inForm: true
  }
]
