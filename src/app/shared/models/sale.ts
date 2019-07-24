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
  grossTotal: number;
  netTotal: number;
}

export class SaleDetail {
  sale: any;
  product: any;
  date: number;
  qty: number;
  rate: number;
  customer: any;
  totalAmount: number;
  paymentType: string;
}

export enum PaymentTypes {
  'none',
  'Cash',
  'Credit'
}
