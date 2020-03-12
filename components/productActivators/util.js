/**
"order_id", "code", "device_id", "expired_at", "isActive"
 */
export const headers = [
  { text: 'Kode', align: 'left', value: 'code' },
  { text: 'Order#', align: 'left', value: 'order_id' },
  { text: 'Device Id', align: 'left', value: 'device_id' },
  { text: 'Aktif', align: 'left', value: 'isActive' },
  { text: 'Tanggal', align: 'left', value: 'created_at' },
]

export const downloadData = []

export const formItem = [
  {
    text: 'Order',
    value: 'order_id',
    el: 'text',
    rules: '',
    disabled: true,
    inForm: true,
  },
  {
    text: 'Kode',
    value: 'code',
    el: 'text',
    type: 'text',
    rules: 'required|max:20',
    inForm: true,
  },
  {
    text: 'Device Id',
    value: 'device_id',
    el: 'text',
    type: 'text',
    rules: 'required|max:20',
    inForm: true,
  },
  {
    text: 'Tanggal Kadaluarsa',
    value: 'expired_at',
    el: 'date',
    rules: '',
    inForm: true,
  },

  {
    text: 'Aktif',
    value: 'isActive',
    el: 'switch',
    rules: '',
    inForm: true,
  },
]
