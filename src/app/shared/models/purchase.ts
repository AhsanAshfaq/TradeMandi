import { Product } from './product';
import { Supplier } from './supplier';

export class Purchase {
  builtyNumber: string;
  amount: string;
  quantity: number;
  purchaseDate: Date;
  product: any;
  supplier: any;
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
