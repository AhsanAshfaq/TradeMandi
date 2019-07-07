import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { PurchaseApiService } from '../../shared/services/purchases.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentTypes, Purchase } from '../../shared/models/purchase';
import { ApiService } from '../../shared/services/products.service';
import { ApiService as SupplierApiService } from '../../shared/services/suppliers.service';
import { Supplier } from 'src/app/shared/models/supplier';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-edit-purchase',
  templateUrl: './edit-purchase.component.html',
  styleUrls: ['./edit-purchase.component.css']
})

export class EditPurchaseComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('resetPurchaseForm', { static: true }) myNgForm;
  purchaseForm: FormGroup;
  purchaseData: Purchase;
  productList: any = [];
  supplierList: any = [];
  paymentTypes = PaymentTypes;
  keys: string[];

  ngOnInit() {

  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private purchaseApi: PurchaseApiService,
    private productApi: ApiService,
    private supplierApi: SupplierApiService
  ) {
    this.fillMetaData();
    this.updateBookForm();
    this.keys = Object.keys(this.paymentTypes).filter(Number);
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.purchaseApi.GetPurchase(id).subscribe(data => {
      this.setPurchaseData(data);
      this.purchaseForm = this.fb.group({
        builtyNumber: [data.builtyNumber, [Validators.required]],
        quantity: [data.quantity, [Validators.required]],
        amount: [data.amount, [Validators.required]],
        purchaseDate: [data.purchaseDate, [Validators.required]],
        truckNumber: [data.truckNumber, [Validators.required]],
        product: [data.product, [Validators.required]],
        supplier: [data.supplier, [Validators.required]],
        paymentType: [data.paymentType.toString(), [Validators.required]]
      });
    });
  }
  setPurchaseData(data: Purchase) {
    this.purchaseData = data;
    console.log(this.purchaseData);
    const productControl = 'product';
    this.purchaseForm.controls[productControl].setValue(this.purchaseData.product);
    const supplierControl = 'supplier';
    this.purchaseForm.controls[supplierControl].setValue(this.purchaseData.supplier);
  }

  formatDate(e) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.purchaseForm.get('purchaseDate').setValue(convertDate, {
      onlyself: true
    });
  }
  fillMetaData() {
    this.productApi.GetProducts().subscribe(data => {
      let products: any = [];
      products = data;
      products.forEach((element: Product) => {
        this.productList.push(element);
      });
    });
    this.supplierApi.GetSuppliers().subscribe(data => {
      let suppliers: any = [];
      suppliers = data;
      suppliers.forEach((element: Supplier) => {
        this.supplierList.push(element);
      });
    });
  }
  /* Reactive book form */
  updateBookForm() {
    this.purchaseForm = this.fb.group({
      builtyNumber: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      purchaseDate: ['', [Validators.required]],
      truckNumber: ['', [Validators.required]],
      product: [this.productList],
      supplier: [this.supplierList],
      paymentType: [this.paymentTypes]
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.purchaseForm.controls[controlName].hasError(errorName);
  }

  updatePurchaseForm() {
    console.log(this.purchaseForm.value);
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you want to update?')) {
      this.purchaseApi.UpdatePurchase(id, this.purchaseForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/purchases-list'));
      });
    }
  }
}
