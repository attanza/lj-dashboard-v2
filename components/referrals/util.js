/**
code: string;
  description: string;
  products: IProduct[];
  creator: IUser;
  maxConsumer: number;
  consumer: IUser[];
  validUntil: Date;
  isExpired: boolean;
  createdAt: Date;
  updatedAt: Date;
 */

export const headers = [
  { text: "Kode", align: "left", value: "code" },
  { text: "Creator", align: "left", value: "creator" },
  { text: "Status", align: "left", value: "isExpired" },
  { text: "Tanggal", align: "left", value: "createdAt" }
]

export const downloadData = []

export const formItem = [
  {
    text: "Kode",
    value: "code",
    el: "text",
    type: "text",
    rules: "min:3",
    inForm: true
  },
  {
    text: "Berlaku sampai",
    value: "validUntil",
    el: "date",
    rules: "",
    inForm: true
  },
  {
    text: "Expired",
    value: "isExpired",
    el: "switch",
    rules: "",
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
