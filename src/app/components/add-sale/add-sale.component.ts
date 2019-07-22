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
  selectedPaymentType: any;
  lineItems = [];
  currentStringDate: any;
  saleDetailList = [];
  isEditMode = false;
  editField: string;
    personList: Array<any> = [
      { id: 1, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
      { id: 2, name: 'Guerra Cortez', age: 45, companyName: 'Insectus', country: 'USA', city: 'San Francisco' },
      { id: 3, name: 'Guadalupe House', age: 26, companyName: 'Isotronic', country: 'Germany', city: 'Frankfurt am Main' },
      { id: 4, name: 'Aurelia Vega', age: 30, companyName: 'Deepends', country: 'Spain', city: 'Madrid' },
      { id: 5, name: 'Elisa Gallagher', age: 31, companyName: 'Portica', country: 'United Kingdom', city: 'London' },
    ];

    awaitingPersonList: Array<any> = [
      { id: 6, name: 'George Vega', age: 28, companyName: 'Classical', country: 'Russia', city: 'Moscow' },
      { id: 7, name: 'Mike Low', age: 22, companyName: 'Lou', country: 'USA', city: 'Los Angeles' },
      { id: 8, name: 'John Derp', age: 36, companyName: 'Derping', country: 'USA', city: 'Chicago' },
      { id: 9, name: 'Anastasia John', age: 21, companyName: 'Ajo', country: 'Brazil', city: 'Rio' },
      { id: 10, name: 'John Maklowicz', age: 36, companyName: 'Mako', country: 'Poland', city: 'Bialystok' },
    ];

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

    updateList(id: number, property: string, event: any) {
      const editField = event.target.textContent;
      this.personList[id][property] = editField;
    }

    remove(id: any) {
      this.awaitingPersonList.push(this.personList[id]);
      this.personList.splice(id, 1);
    }

    add() {
      if (this.awaitingPersonList.length > 0) {
        const person = this.awaitingPersonList[0];
        this.personList.push(person);
        this.awaitingPersonList.splice(0, 1);
      }
    }

    changeValue(id: number, property: string, event: any) {
      this.editField = event.target.textContent;
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
      productId: this.selectedProduct,
      paymentType: 'Cash'
    };
    if (this.lineItems.length === 1) {
      let customerName = '';
      let productName = '';
      customerName = this.getCustomerName();
      productName = this.getProductName(productName);
      this.lineItems[0].customerName = customerName;
      this.lineItems[0].productName = productName;
      this.lineItems[0].paymentType = this.selectedPaymentType;
      this.saleDetailList.push(this.lineItems[0]);
    }
    this.lineItems = [lineItem];
    // this.qtyColumn.nativeElement.focus();
  }

  private getCustomerName(customerId?) {
    let customerName = '';
    if (customerId === undefined) {
      customerId = this.lineItems[0].customer;
    }
    this.customerList.forEach(element => {
      if (element._id === customerId) {
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
    const tempArray = JSON.parse(JSON.stringify(this.saleDetailList));
    const clickedItem = tempArray.reverse()[i];
    this.lineItems = [];
    this.lineItems.push(clickedItem);
    this.selectedProduct = this.getProductId(clickedItem.productName);
    this.selectedCustomerName = clickedItem.customer;
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
    this.saleForm = this.fb.group({
      builtyNumber: [''],
      truckRent: ['', [Validators.required]],
      description: [''],
      saleDate: ['', [Validators.required]],
      truckNumber: ['', [Validators.required]],
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
