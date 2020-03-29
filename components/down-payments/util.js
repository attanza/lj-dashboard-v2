export let headers = [
  { text: "No Transaksi", align: "left", value: "transaction_no" },
  { text: "Kode Target", align: "left", value: "marketing_target_id" },
  { text: "Nama Mahasiswa", align: "left", value: "name" },
  { text: "Telpon", align: "left", value: "phone" },
  { text: "DP", align: "left", value: "dp" },
  { text: "Tanggal", align: "left", value: "created_at" }
]

export const downloadData = []

export const formItem = [
  {
    text: "No Transaksi",
    value: "transaction_no",
    el: "text",
    type: "text",
    rules: "required|max:20",
    inForm: true
  },
  {
    text: "Target",
    value: "marketing_target_id",
    el: "combobox",
    items: [],
    inForm: true,
    rules: "required|integer"
  },
  {
    text: "Nama Mahasiswa",
    value: "name",
    el: "text",
    type: "text",
    rules: "required|max:100",
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
    text: "DP",
    value: "dp",
    el: "text",
    type: "number",
    rules: "required|integer",
    inForm: true
  }
]
