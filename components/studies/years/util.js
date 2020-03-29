export let headers = [
  { text: "Angkatan", align: "left", value: "year" },
  {
    text: "Kelas per Angkatan",
    align: "left",
    value: "class_per_year"
  },
  { text: "Siswa per Kelas", value: "students_per_class" },
  { text: "Aksi", value: "name", sortable: false }
]

export const downloadData = [
  "id",
  "study_program_id",
  "year",
  "class_per_year",
  "students_per_class",
  "created_at"
]

export const formItem = [
  {
    value: "year",
    text: "Angkatan",
    rules: "required|max:4",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "class_per_year",
    text: "Kelas per Angkatan",
    rules: "required|integer",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "students_per_class",
    text: "Siswa per Kelas",
    rules: "required|integer",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "study_program_id",
    text: "Program Studi",
    el: "combobox",
    items: [],
    inForm: true,
    rules: "required|integer"
  }
]
