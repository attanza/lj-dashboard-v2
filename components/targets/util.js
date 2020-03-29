export let headers = [
  { text: "Kode", align: "left", value: "code" },
  { text: "Universitas", align: "left", value: "study.university.name" },
  { text: "Studi Program", align: "left", value: "study.studyName.name" },
  { text: "Tahun", align: "left", value: "angkatan" },
  { text: "Tanggal", align: "left", value: "created_at" }
]

export const downloadData = [
  "id",
  "code",
  "study_program_id",
  "angkatan",
  "description",
  "created_at"
]

export const formItem = [
  {
    text: "Kode",
    value: "code",
    el: "text",
    type: "text",
    rules: "required|max:20",
    inForm: true
  },

  {
    text: "Universitas",
    value: "university_id",
    el: "combobox",
    items: [],
    rules: "required|integer",
    inForm: true
  },
  {
    text: "Program Studi",
    value: "study_program_id",
    el: "combobox",
    items: [],
    rules: "required|integer",
    inForm: true
  },

  {
    text: "Angkatan",
    value: "angkatan",
    el: "text",
    type: "text",
    rules: "required|max:10",
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
