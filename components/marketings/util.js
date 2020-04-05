export let headers = [
  { text: "Nama", align: "left", value: "name" },
  { text: "Email", align: "left", value: "email" },
  { text: "Telepon", align: "left", value: "phone" },
  { text: "Status", align: "left", value: "is_active" }
]

export const referralHeaders = [
  { text: "Kode", align: "left", value: "code" },
  { text: "Expired", align: "left", value: "isExpired" },
  { text: "Tanggal", align: "left", value: "createdAt" },
  { text: "Deskripsi", align: "left", value: "description" }
]

export const consumerHeaders = [
  { text: "Email", align: "left", value: "email" },
  { text: "Tanggal", align: "left", value: "date" }
]

export const downloadData = [
  "id",
  "uid",
  "name",
  "email",
  "phone",
  "description",
  "address",
  "is_active"
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
    value: "email",
    text: "Email",
    rules: "required|email",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "phone",
    text: "Telepon",
    rules: "required|max:30",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "password",
    text: "Password",
    rules: "required|min:6",
    el: "text",
    type: "text",
    inForm: true
  },
  {
    value: "is_active",
    text: "Status aktif",
    rules: "required",
    el: "switch",
    inForm: true
  },
  {
    value: "address",
    text: "Alamat",
    rules: "max:250",
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
