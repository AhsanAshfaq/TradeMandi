export class Sale {
  builtyNumber: string;
  truckNumber: string;
  truckRent: number;
  commission: number;
  labour: number;
  marketCommittee: number;
  munshiana: number;
  saleDate: Date;
  saleDetails: [SaleDetail];
  description: string;
}

export class SaleDetail {
  sale: any;
  product: any;
  numberOfBags: number;
  lineItems: [LineItem];
}

export class LineItem {
  date: number;
  qty: number;
  rate: number;
  customer: any;
  totalAmount: number;
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
