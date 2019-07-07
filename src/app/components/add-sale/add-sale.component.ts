import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from '../../shared/services/products.service';
import { SaleApiService } from '../../shared/services/sales.service';
import { ApiService as CustomerApiService } from '../../shared/services/customers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentTypes } from 'src/app/shared/models/sale';
import { Customer as CustomerModel } from 'src/app/shared/models/customer';


@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})

export class AddSaleComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('resetSaleForm', { static: true }) myNgForm;
  saleForm: FormGroup;
  productList: any = [];
  customerList: any = [];
  paymentTypes = PaymentTypes;
  keys: string[];
  selectedCustomerName: any;

ngOnInit() {
  this.submitBookForm();
}

constructor(
  public fb: FormBuilder,
  private router: Router,
  private ngZone: NgZone,
  private salesApi: SaleApiService,
  private productApi: ApiService,
  private customerApi: CustomerApiService
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
  this.customerApi.GetCustomers().subscribe(data => {
    let customers: any = [];
    customers = data;
    customers.forEach((element: CustomerModel) => {
      this.customerList.push(element);
    });
  });
}

submitBookForm() {
  this.saleForm = this.fb.group({
    builtyNumber: ['', [Validators.required]],
    quantity: ['', [Validators.required]],
    amount: ['', [Validators.required]],
    saleDate: ['', [Validators.required]],
    truckNumber: ['', [Validators.required]],
    product: ['', [Validators.required]],
    customer: ['', [Validators.required]],
    paymentType: [PaymentTypes.Cash.toString(), [Validators.required]]
  });
}

formatDate(e) {
  const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
  this.saleForm.get('saleDate').setValue(convertDate, {
    onlyself: true
  });
}

  public handleError = (controlName: string, errorName: string) => {
  return this.saleForm.controls[controlName].hasError(errorName);
}

submitSaleForm() {
  if (this.saleForm.valid) {
    this.salesApi.AddSale(this.saleForm.value).subscribe(res => {
      this.ngZone.run(() => this.router.navigateByUrl('/sales-list'));
    });
  }
}
}

