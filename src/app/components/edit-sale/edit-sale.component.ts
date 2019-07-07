import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SaleApiService } from '../../shared/services/sales.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentTypes, Sale } from '../../shared/models/sale';
import { ApiService } from '../../shared/services/products.service';
import { ApiService as CustomerApiService } from '../../shared/services/customers.service';
import { Customer } from 'src/app/shared/models/customer';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-edit-sale',
  templateUrl: './edit-sale.component.html',
  styleUrls: ['./edit-sale.component.css']
})

export class EditSaleComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('resetSaleForm', { static: true }) myNgForm;
  saleForm: FormGroup;
  saleData: Sale;
  productList: any = [];
  customerList: any = [];
  paymentTypes = PaymentTypes;
  keys: string[];

  ngOnInit() {

  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private saleApi: SaleApiService,
    private productApi: ApiService,
    private customerApi: CustomerApiService
  ) {
    this.fillMetaData();
    this.updateBookForm();
    this.keys = Object.keys(this.paymentTypes).filter(Number);
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.saleApi.GetSale(id).subscribe(data => {
      this.setSaleData(data);
      this.saleForm = this.fb.group({
        builtyNumber: [data.builtyNumber, [Validators.required]],
        quantity: [data.quantity, [Validators.required]],
        amount: [data.amount, [Validators.required]],
        saleDate: [data.saleDate, [Validators.required]],
        truckNumber: [data.truckNumber, [Validators.required]],
        product: [data.product, [Validators.required]],
        customer: [data.customer, [Validators.required]],
        paymentType: [data.paymentType.toString(), [Validators.required]]
      });
    });
  }
  setSaleData(data: Sale) {
    this.saleData = data;
    console.log(this.saleData);
    const productControl = 'product';
    this.saleForm.controls[productControl].setValue(this.saleData.product);
    const customerControl = 'customer';
    this.saleForm.controls[customerControl].setValue(this.saleData.customer);
  }

  formatDate(e) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.saleForm.get('saleDate').setValue(convertDate, {
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
    this.customerApi.GetCustomers().subscribe(data => {
      let customers: any = [];
      customers = data;
      customers.forEach((element: Customer) => {
        this.customerList.push(element);
      });
    });
  }
  /* Reactive book form */
  updateBookForm() {
    this.saleForm = this.fb.group({
      builtyNumber: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      saleDate: ['', [Validators.required]],
      truckNumber: ['', [Validators.required]],
      product: [this.productList],
      customer: [this.customerList],
      paymentType: [this.paymentTypes]
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.saleForm.controls[controlName].hasError(errorName);
  }

  updateSaleForm() {
    console.log(this.saleForm.value);
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you want to update?')) {
      this.saleApi.UpdateSale(id, this.saleForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/sales-list'));
      });
    }
  }
}
