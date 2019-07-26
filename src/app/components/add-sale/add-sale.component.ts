import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone, Directive, AfterViewInit, ElementRef } from '@angular/core';
import { ApiService } from '../../shared/services/products.service';
import { SaleApiService } from '../../shared/services/sales.service';
import { SaleDetailApiService } from '../../shared/services/saleDetail.service';
import { ApiService as CustomerApiService } from '../../shared/services/customers.service';
import { ApiService as SupplierApiService } from '../../shared/services/suppliers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentTypes, Sale } from 'src/app/shared/models/sale';
import { SaleDetail } from 'src/app/shared/models/saleDetail'
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
  @ViewChild('resetSaleForm', { static: true }) myNgForm: any;
  @ViewChild('qty', { static: true }) qtyColumn: any;
  saleForm: FormGroup;
  productList: any = [];
  selectedProduct = '';
  customerList: any = [];
  supplierList: any = [];
  selectedSupplier = '';
  paymentTypes = PaymentTypes;
  keys: string[];
  selectedCustomerName: any;
  selectedPaymentType: any;
  lineItems = [];
  currentStringDate: any;
  saleDetailList = [];
  isEditMode = false;
  saleId: any;
  ngOnInit() {
    this.submitBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private salesApi: SaleApiService,
    private productApi: ApiService,
    private customerApi: CustomerApiService,
    private supplierAPi: SupplierApiService,
    private saleDetailApi: SaleDetailApiService
  ) {
    this.keys = Object.keys(this.paymentTypes).filter(Number);
    this.fillMetaData();
    this.currentStringDate = new Date().toISOString().substring(0, 10);
  }

  fillMetaData() {
    this.supplierAPi.GetSuppliers().subscribe(data => {
      let suppliers: any = [];
      suppliers = data;
      suppliers.forEach(element => {
        this.supplierList.push(element);
      });
    });
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
    if (this.saleForm.pristine) {
      if (!this.saleForm.valid) {
        this.saleForm.markAllAsTouched();
        alert('Please add basic information to proceed.');
        return;
      }
    }
    this.sendSaleAddRequest();
    const lineItem = this.getDefaultLineItem();
    if (this.lineItems.length === 1) {
      this.getLineItemRecordForGrid();
      this.saleDetailList.push(this.lineItems[0]);
      const saleDetailObj = this.createSaleDetailForAdd();
      this.saleDetailApi.GetSaleDetails().subscribe( data => {
        console.log(data);
      });
      this.saleDetailApi.AddSaleDetail(saleDetailObj);
    }
    this.lineItems = [lineItem];
    // this.qtyColumn.nativeElement.focus();
  }
  private createSaleDetailForAdd() {
    const saleDetailObj = new SaleDetail();
    saleDetailObj.customer = this.selectedCustomerName;
    saleDetailObj.product = this.selectedProduct;
    saleDetailObj.date = this.lineItems[0].date;
    saleDetailObj.paymentType = this.lineItems[0].paymentType;
    saleDetailObj.qty = this.lineItems[0].qty;
    saleDetailObj.rate = this.lineItems[0].rate;
    saleDetailObj.totalAmount = this.lineItems[0].totalAmount;
    saleDetailObj.sale = this.saleId;
    return saleDetailObj;
  }

  private getLineItemRecordForGrid() {
    let customerName = '';
    let productName = '';
    customerName = this.getCustomerName();
    productName = this.getProductName(productName);
    this.lineItems[0].customerName = customerName;
    this.lineItems[0].productName = productName;
    this.lineItems[0].paymentType = this.selectedPaymentType;
  }

  private getDefaultLineItem() {
    return {
      date: this.currentStringDate,
      rate: 0,
      qty: 0,
      customer: '',
      customers: JSON.parse(JSON.stringify(this.customerList)),
      totalAmount: 0,
      customerName: '',
      productName: '',
      productId: this.selectedProduct,
      paymentType: 'Cash'
    };
  }

  sendSaleAddRequest() {
    if (this.saleId === undefined) {
      const saleObj = new Sale();
      saleObj.truckNumber = this.saleForm.value.truckNumber;
      saleObj.builtyNumber = this.saleForm.value.builtyNumber;
      saleObj.description = this.saleForm.value.description;
      saleObj.truckRent = this.saleForm.value.truckRent;
      saleObj.saleDate = new Date();
      saleObj.grossTotal = 0;
      saleObj.netTotal = 0;
      this.salesApi.AddSale(saleObj).subscribe(data => {
        this.saleId = data._id;
      });
    }
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
      supplier: ['', [Validators.required]]
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
