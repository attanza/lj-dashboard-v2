export let headers = [
  { text: "Kode Laporan", align: "left", value: "code" },
  {
    text: "Perguruan Tinggi",
    align: "left",
    value: "schedulle.target.study.university.name"
  },
  {
    text: "Program Studi",
    align: "left",
    value: "schedulle.target.study.studyName.name"
  },
  { text: "Aksi", align: "left", value: "schedulle.action.name" },
  { text: "Tanggal", align: "left", value: "created_at" }
]

export const downloadData = []
export const marketingMethods = ["By Phone", "By Meeting"]

export const formItem = [
  {
    text: "Kode Laporan",
    value: "code",
    el: "text",
    type: "text",
    rules: "required|max:20",
    inForm: true
  },
  {
    text: "Jadwal",
    value: "schedulle_id",
    el: "combobox",
    items: [],
    inForm: true,
    rules: "required|integer"
  },
  {
    text: "Metode",
    value: "method",
    el: "combobox",
    items: [],
    inForm: true,
    rules: "required"
  },
  {
    text: "Tanggal",
    value: "date",
    el: "date",
    type: "text",
    rules: "required",
    inForm: true
  },
  {
    text: "Persyaratan",
    value: "terms",
    el: "text",
    type: "text",
    rules: "max:250",
    inForm: true
  },

  {
    text: "Catatan",
    value: "note",
    el: "text",
    type: "text",
    rules: "max:250",
    inForm: true
  },
  {
    text: "Hasil",
    value: "result",
    el: "textarea",
    rules: "",
    inForm: true
  },
  {
    text: "Latitude",
    value: "lat",
    el: "text",
    type: "text",
    rules: "numeric",
    inForm: true
  },
  {
    text: "Longitude",
    value: "lng",
    el: "text",
    type: "text",
    rules: "numeric",
    inForm: true
  },
  {
    text: "Keterangan",
    value: "description",
    el: "textarea",
    rules: "",
    inForm: true
  }
]
