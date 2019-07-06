export class Product {
  // tslint:disable-next-line:variable-name
  _id: string;
  name: string;
  quantity: number;
  unit: {
    type: UnitTypes,
    default: UnitTypes.Crate
  };
  description: string;
  purchaseWarningLimit: number;
  purchases: [{}];
}

export enum UnitTypes {
  'none',
  'Kg',
  'Bag',
  'Crate'
}
