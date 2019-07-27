import { SaleDetail } from './saleDetail';

export class Sale {
  builtyNumber: string;
  truckNumber: string;
  truckRent: number;
  commission: number;
  labour: number;
  marketCommittee: number;
  munshiana: number;
  saleDate: Date;
  saleDetails: any[];
  description: string;
  grossTotal: number;
  netTotal: number;
  supplier: any;
}



export enum PaymentTypes {
  'Cash',
  'Credit'
}
