export let headers = [
  { text: "Code", align: "left", value: "code" },
  { text: "Marketing Target", align: "left", value: "marketing_target_id" },
  { text: "Marketing", align: "left", value: "marketing_id" },
  { text: "Action", align: "left", value: "marketing_action_id" },
  { text: "Tanggal", align: "left", value: "date" }
]

export const downloadData = [
  "id",
  "marketing_target_id",
  "code",
  "marketing_id",
  "marketing_action_id",
  "date",
  "Deskripsi"
]

export const formItem = [
  {
    text: "Target",
    value: "marketing_target_id",
    el: "combobox",
    items: [],
    inForm: true,
    rules: "required|integer"
  },

  {
    text: "Kode Jadwal",
    value: "code",
    el: "text",
    type: "text",
    rules: "required|max:20",
    inForm: true
  },

  {
    text: "Marketing",
    value: "marketing_id",
    el: "combobox",
    items: [],
    inForm: true,
    rules: "required|integer"
  },

  {
    text: "Action",
    value: "marketing_action_id",
    el: "combobox",
    items: [],
    inForm: true,
    rules: "required|integer"
  },
  {
    text: "Tanggal",
    value: "date",
    el: "date",
    rules: "required",
    inForm: true
  },
  {
    text: "Waktu",
    value: "time",
    el: "time",
    rules: "required",
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
