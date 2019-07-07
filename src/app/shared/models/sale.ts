export class Sale {
  builtyNumber: string;
  amount: string;
  quantity: number;
  purchaseDate: Date;
  product: any;
  customer: any;
  truckNumber: string;
  paymentType: {
    type: PaymentTypes,
    default: PaymentTypes.Cash
  };
}

export enum PaymentTypes {
  'none',
  'Cash',
  'Credit'
}
