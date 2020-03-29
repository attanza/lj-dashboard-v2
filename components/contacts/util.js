export let headers = [
  { text: "Kode Target", align: "left", value: "marketing_target_id" },
  { text: "Nama", align: "left", value: "name" },
  { text: "Jabatan", align: "left", value: "title" },
  { text: "Telpon", align: "left", value: "phone" }
]

export const downloadData = []

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
    text: "Nama",
    value: "name",
    el: "text",
    type: "text",
    rules: "required|max:100",
    inForm: true
  },
  {
    text: "Jabatan",
    value: "title",
    el: "text",
    type: "text",
    rules: "required|max:50",
    inForm: true
  },
  {
    text: "Telpon",
    value: "phone",
    el: "text",
    type: "text",
    rules: "required|max:30",
    inForm: true
  },
  {
    text: "Email",
    value: "email",
    el: "text",
    type: "text",
    rules: "email",
    inForm: true
  }
]
