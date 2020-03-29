/**
'code'
'name'
'measurement'
'price'
'description'
 */

export const headers = [
  { text: "Kode", align: "left", value: "code" },
  { text: "Nama", align: "left", value: "name" },
  { text: "Satuan", align: "left", value: "measurement" },
  { text: "Harga", align: "left", value: "price" },
  { text: "Harga Diskon", align: "left", value: "discount_price" }
]

export const downloadData = []

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
    text: "Nama",
    value: "name",
    el: "text",
    type: "text",
    rules: "required|max:100",
    inForm: true
  },
  {
    text: "Satuan",
    value: "measurement",
    el: "text",
    type: "text",
    rules: "required|max:20",
    inForm: true
  },
  {
    text: "Harga",
    value: "price",
    el: "text",
    type: "number",
    rules: "required|integer",
    inForm: true
  },
  {
    text: "Harga Diskon",
    value: "discount_price",
    el: "text",
    type: "number",
    rules: "required|integer",
    inForm: true
  },

  {
    text: "Deskripsi",
    value: "description",
    el: "textarea",
    rules: "max:250",
    inForm: true
  }
]
