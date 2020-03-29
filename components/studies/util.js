export let headers = [
  { text: "Nama", align: "left", value: "study_name_id" },
  { text: "Universitas", align: "left", value: "university.name" },
  { text: "Nama kontak", value: "contact_person", align: "left" },
  { text: "Telepon", value: "phone", align: "left" },
  { text: "Email", value: "email", align: "left" }
]

export const downloadData = [
  "id",
  "code",
  "study_program_id",
  "description",
  "created_at"
]

export const formItem = [
  {
    value: "university_id",
    text: "Universitas",
    el: "combobox",
    items: [],
    inForm: true,
    rules: "required|integer"
  },
  {
    value: "study_name_id",
    text: "Nama Studi",
    el: "combobox",
    items: [],
    inForm: true,
    rules: "required|integer"
  },

  {
    value: "phone",
    text: "Telepon",
    el: "text",
    type: "text",
    inForm: true,
    rules: "max:30"
  },
  {
    value: "email",
    text: "Email",
    el: "text",
    type: "text",
    inForm: true,
    rules: "email"
  },
  {
    value: "contact_person",
    text: "Nama kontak",
    el: "text",
    type: "text",
    inForm: true,
    rules: "required|max:50"
  },
  {
    value: "address",
    text: "Alamat",
    el: "text",
    type: "text",
    inForm: true,
    rules: "max:250"
  },
  {
    value: "description",
    text: "Deskripsi",
    el: "text",
    type: "text",
    inForm: true,
    rules: "max:250"
  }
]
