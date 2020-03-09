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
  { text: 'Kode', align: 'left', value: 'code' },
  { text: 'Kreator', align: 'left', value: 'creator.email' },
  { text: 'Expired', align: 'left', value: 'isExpired' },
  { text: 'Deskripsi', align: 'left', value: 'description' },
]

export const downloadData = []

export const formItem = [
  {
    text: 'Kode',
    value: 'code',
    el: 'text',
    type: 'text',
    rules: 'required|max:20',
    inForm: true,
  },
  {
    text: 'Deskripsi',
    value: 'description',
    el: 'textarea',
    rules: 'max:250',
    inForm: true,
  },
]
