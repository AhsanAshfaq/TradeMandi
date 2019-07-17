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

export class AddSaleComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('resetSaleForm', { static: true }) myNgForm: any;
  @ViewChild('qty', { static: true }) qtyColumn: any;
  saleForm: FormGroup;
  productList: any = [];
  selectedProduct = '';
  customerList: any = [];
  paymentTypes = PaymentTypes;
  keys: string[];
  selectedCustomerName: any;
  lineItems = [];
  currentStringDate: any;
  saleDetailList = [];
  isEditMode = false;

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
    this.isEditMode = false;
    const resultArray = [];
    for (let index = 0; index < this.customerList.length; index++) {
      // tslint:disable-next-line:no-string-literal
      resultArray[index] = this.customerList[index];
    }
    const lineItem = {
      date: this.currentStringDate,
      rate: 0,
      qty: 0,
      customer: '',
      customers: resultArray,
      totalAmount: 0,
      customerName: '',
      productName: '',
      productId: this.selectedProduct
    };
    if (this.lineItems.length === 1) {
      let customerName = '';
      let productName = '';
      customerName = this.getCustomerName(customerName);
      productName = this.getProductName(productName);
      this.lineItems[0].customerName = customerName;
      this.lineItems[0].productName = productName;
      this.saleDetailList.push(this.lineItems[0]);
    }
    this.lineItems = [lineItem];
    // this.qtyColumn.nativeElement.focus();
  }

  private getCustomerName(customerName: string) {
    this.customerList.forEach(element => {
      if (element._id === this.lineItems[0].customer) {
        customerName = element.name;
      }
    });
    return customerName;
  }

  private getProductName(productName: string) {
    this.productList.forEach(element => {
      if (element._id === this.selectedProduct) {
        productName = element.name;
      }
    });
    return productName;
  }

  private getProductId(productName: string) {
    let productId = '';
    this.productList.forEach(element => {
      if (element.name === productName) {
        productId = element._id;
      }
    });
    return productId;
  }

  onEdit($event, i) {
    if (this.isEditMode) {
      alert('You can edit one item at a time.');
      return;
    }
    this.isEditMode = true;
    const tempArray = JSON.parse(JSON.stringify(this.saleDetailList));
    const clickedItem = tempArray.reverse()[i];
    this.lineItems = [];
    this.lineItems.push(clickedItem);
    this.selectedProduct = this.getProductId(clickedItem.productName);
    for (let index = this.saleDetailList.length - 1; index >= 0; --index) {
      if (this.saleDetailList[index].productName === clickedItem.productName
        && this.saleDetailList[index].customer === clickedItem.customer
        && this.saleDetailList[index].qty === clickedItem.qty
      ) {
        this.saleDetailList.splice(index, 1);
      }
    }
  }

  onDelete($event, i) {
    if (this.isEditMode) {
      alert('Please complete your edit first.');
      return;
    }
    const tempArray = JSON.parse(JSON.stringify(this.saleDetailList));
    const clickedItem = tempArray.reverse()[i];
    for (let index = this.saleDetailList.length - 1; index >= 0; --index) {
      if (this.saleDetailList[index].productName === clickedItem.productName
        && this.saleDetailList[index].customer === clickedItem.customer
        && this.saleDetailList[index].qty === clickedItem.qty
      ) {
        this.saleDetailList.splice(index, 1);
      }
    }
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
    this.lineItems[i].customer = $event.value;
  }
  onChangeDate($event, i) {
    this.lineItems[i].date = Date.parse($event.target.value);
  }

  submitBookForm() {
    const isConfirmed = confirm('Are you sure to submit');
    if (isConfirmed) {
    this.saleForm = this.fb.group({
      builtyNumber: [''],
      truckRent: ['', [Validators.required]],
      description: [''],
      saleDate: ['', [Validators.required]],
      truckNumber: ['', [Validators.required]],
    });
  } else {return; }
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
