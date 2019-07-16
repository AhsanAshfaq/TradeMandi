import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone, Directive, AfterViewInit, ElementRef } from '@angular/core';
import { ApiService } from '../../shared/services/products.service';
import { SaleApiService } from '../../shared/services/sales.service';
import { ApiService as CustomerApiService } from '../../shared/services/customers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentTypes } from 'src/app/shared/models/sale';
import { Customer as CustomerModel } from 'src/app/shared/models/customer';
import { getLocaleDateTimeFormat } from '@angular/common';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})

@Directive({
  selector: '[appAutofocus]'
})

export class AddSaleComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('resetSaleForm', { static: true }) myNgForm: any;
  saleForm: FormGroup;
  productList: any = [];
  customerList: any = [];
  paymentTypes = PaymentTypes;
  keys: string[];
  selectedCustomerName: any;
  lineItems = [];
  currentStringDate: any;

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
    this.currentStringDate = new Date().toISOString().substring(0, 10);
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

  startNewTable(event) {
    const resultArray = [];
    for (let index = 0; index < this.customerList.length; index++) {
      // tslint:disable-next-line:no-string-literal
      resultArray[index] = this.customerList[index];
    }
    const lineItemModel = {
      date: this.currentStringDate,
      qty: 0,
      rate: 0,
      customers: resultArray,
      totalAmount: 0,
      customer: ''
    };
    this.lineItems.push(lineItemModel);

  }

  onChangeQty($event, i) {
    // tslint:disable-next-line:radix
    this.lineItems[i].qty = parseInt($event.target.value);
  }
  onChangeRate($event, i) {
    // tslint:disable-next-line:radix
    this.lineItems[i].rate = parseInt($event.target.value);
    this.lineItems[i].totalAmount = this.lineItems[i].rate * this.lineItems[i].qty;
  }
  onChangeCustomer($event, i) {
    debugger
    this.lineItems[i].customer = $event.value;
  }
  onChangeDate($event, i) {
    this.lineItems[i].date = Date.parse($event.target.value);
  }

  submitBookForm() {
    this.saleForm = this.fb.group({
      builtyNumber: [''],
      truckRent: ['', [Validators.required]],
      description: [''],
      saleDate: ['', [Validators.required]],
      truckNumber: ['', [Validators.required]],
      // product: ['', [Validators.required]],
      // customer: ['', [Validators.required]],
      // paymentType: [PaymentTypes.Cash.toString(), [Validators.required]]
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


@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }

}
