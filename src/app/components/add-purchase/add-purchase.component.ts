import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from '../../shared/services/products.service';
import { PurchaseApiService } from '../../shared/services/purchases.service';
import { ApiService as SupplierApiService } from '../../shared/services/suppliers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentTypes } from '../../shared/models/purchase';


@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})

export class AddPurchaseComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('resetPurchaseForm', { static: true }) myNgForm;
  purchaseForm: FormGroup;
  productList: any = [];
  supplierList: any = [];
  paymentTypes = PaymentTypes;
  keys: string[];

  ngOnInit() {
    this.submitBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private purchasesApi: PurchaseApiService,
    private productApi: ApiService,
    private supplierApi: SupplierApiService
  ) {
    this.keys = Object.keys(this.paymentTypes).filter(Number);
    this.fillMetaData();
  }

  fillMetaData() {
    this.productApi.GetProducts().subscribe(data => {
      let products: any = [];
      products = data;
      products.forEach(element => {
        this.productList.push(element);
      });
    });
    this.supplierApi.GetSuppliers().subscribe(data => {
      let suppliers: any = [];
      suppliers = data;
      suppliers.forEach(element => {
        this.supplierList.push(element);
      });
    });
  }

  submitBookForm() {
    this.purchaseForm = this.fb.group({
      builtyNumber: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      purchaseDate: ['', [Validators.required]],
      truckNumber: ['', [Validators.required]],
      product: ['', [Validators.required]],
      supplier: ['', [Validators.required]],
      paymentType: [PaymentTypes.Cash.toString(), [Validators.required]]
    });
  }

  formatDate(e) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.purchaseForm.get('purchaseDate').setValue(convertDate, {
      onlyself: true
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.purchaseForm.controls[controlName].hasError(errorName);
  }

  submitPurchaseForm() {
    if (this.purchaseForm.valid) {
      this.purchasesApi.AddPurchase(this.purchaseForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/purchases-list'));
      });
    }
  }
}
