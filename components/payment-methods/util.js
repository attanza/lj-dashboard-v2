export const headers = [
  { text: "Name", align: "left", value: "name" },
  { text: "Active", align: "left", value: "is_active" }
]

export const downloadData = ["id", "name", "is_active"]

export const formItem = [
  {
    text: "Nama",
    value: "name",
    el: "text",
    type: "text",
    rules: "required|max:50",
    inForm: true
  },

  {
    text: "Active",
    value: "is_active",
    el: "switch",
    inForm: true
  }
]
