/**
"order_no": "1583921519",
"name": "Dani",
"email": "myrbx.747@gmail.com",
"phone": "0856897698",
"university": "Widyatama",
"device_id": "780hjkhl",
"referral": "1583906815",
"status": "WAITING_FOR_PAYMENT",
"price": 250000,
"marketing_id": 1,
"product_id": 3,
"marketing": {
    "id": 1,
    "name": "Super Administrator",
    "email": "super_administrator@langsungjalan.com"
},
"product": {
    "id": 3,
    "name": "Siizadat jeh wigozu.",
    "code": "0fd24b2a",
    "price": 283601,
    "discount_price": 250000
}
 */
export const orderStatus = [
  {
    id: "WAITING_FOR_PAYMENT",
    name: "WAITING_FOR_PAYMENT"
  },
  {
    id: "PAYMENT_EXPIRED",
    name: "PAYMENT_EXPIRED"
  },
  {
    id: "PAYMENT_FAILED",
    name: "PAYMENT_FAILED"
  },
  {
    id: "COMPLETED",
    name: "COMPLETED"
  },
  {
    id: "CANCELED",
    name: "CANCELED"
  }
]
export const headers = [
  { text: "Order#", align: "left", value: "order_no" },
  { text: "Nama", align: "left", value: "name" },
  { text: "Harga", align: "left", value: "price" },
  { text: "Status", align: "left", value: "status" },
  { text: "Tanggal Bayar", align: "left", value: "paid_at" }
]

export const downloadData = ["id", "paid_at"]

export const formItem = [
  {
    text: "Order #",
    value: "order_no",
    el: "text",
    type: "text",
    disabled: true,
    rules: "",
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
    text: "Email",
    value: "email",
    el: "text",
    type: "text",
    rules: "required|email",
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
    text: "Universitas",
    value: "university",
    el: "text",
    type: "text",
    rules: "required|max:50",
    inForm: true
  },

  {
    text: "Device Id",
    value: "device_id",
    el: "text",
    rules: "required|max:20",
    inForm: true
  },
  {
    text: "Referral",
    value: "referral",
    el: "text",
    disabled: true,
    rules: "",
    inForm: true
  },
  {
    text: "Status",
    value: "status",
    el: "combobox",
    rules: "required",
    inForm: true
  },

  {
    text: "Marketing",
    value: "marketing_id",
    el: "text",
    rules: "",
    inForm: true
  },
  {
    text: "Product",
    value: "product_id",
    el: "combobox",
    rules: "required|integer",
    inForm: true
  },
  {
    text: "Harga",
    value: "price",
    el: "text",
    rules: "",
    inForm: true
  },
  {
    text: "Kode Aktifasi",
    value: "activation_code",
    el: "text",
    disabled: true,
    rules: "",
    inForm: true
  },
  {
    text: "Aktif",
    value: "is_disabled",
    el: "switch",
    rules: "",
    inForm: true
  },
  {
    text: "Tanggal Bayar",
    value: "paid_at",
    el: "text",
    disabled: true,
    rules: "",
    inForm: true
  }
]
