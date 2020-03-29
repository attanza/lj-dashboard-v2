export const headers = [
  { text: "Perguruan Tinggi", align: "left", value: "name" },
  { text: "Nama Kontak", value: "contact_person", align: "left" },
  { text: "Telepon", value: "phone", align: "left" },
  { text: "Email", value: "email", align: "left" },
  { text: "Kota", value: "city", align: "left" }
]

export const downloadData = [
  "id",
  "name",
  "contact_person",
  "phone",
  "email",
  "province",
  "city",
  "address",
  "description"
]

export const formItem = [
  {
    value: "name",
    text: "Nama",
    rules: "required|max:50",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "phone",
    text: "Telepon",
    rules: "max:30",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "email",
    text: "Email",
    rules: "email",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "contact_person",
    text: "Nama kontak",
    rules: "required|max:50",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "province",
    text: "Provinsi",
    rules: "required|max:50",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "city",
    text: "Kota",
    rules: "required|max:50",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "address",
    text: "Alamat",
    rules: "required|max:250",
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
