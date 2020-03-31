export const activitiesHeaders = [
  { text: "IP", align: "left", value: "ip" },
  { text: "Browser", align: "left", value: "browser" },
  { text: "Activity", align: "left", value: "activity" },
  { text: "Tanggal", align: "left", value: "createdAt" }
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
