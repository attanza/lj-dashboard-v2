export const headers = [
  { text: "Nama", align: "left", value: "name" },
  { text: "Email", align: "left", value: "email" },
  { text: "Telepon", align: "left", value: "phone" },
  { text: "Status", align: "left", value: "is_active" }
]

export const downloadData = [
  "id",
  "name",
  "email",
  "phone",
  "is_active",
  "address",
  "description"
]

export const formItem = [
  {
    text: "Nama",
    value: "name",
    el: "text",
    type: "text",
    inForm: true,
    rules: "required|max:50"
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
    type: "password",
    inForm: true
  },
  {
    value: "roles",
    text: "Role",
    rules: "required|integer",
    items: [],
    el: "combobox",
    inForm: true
  },
  {
    value: "is_active",
    text: "Status aktif",
    rules: "",
    el: "switch",
    type: "text",
    inForm: true
  },
  {
    value: "address",
    text: "Alamat",
    rules: "max:250",
    el: "text",
    type: "textarea",
    inForm: true
  },
  {
    value: "description",
    text: "Deskripsi",
    rules: "max:250",
    el: "textarea",
    type: "text",
    inForm: true
  }
]

export const activityHeaders = [
  { text: "User", align: "left", value: "user.email" },
  { text: "Browser", align: "left", value: "browser" },
  { text: "Activitas", align: "left", value: "activity" },
  { text: "Tanggal", align: "left", value: "createdAt" }
]

export const activityDownloadData = []
