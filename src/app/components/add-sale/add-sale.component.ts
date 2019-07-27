import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone, Directive, AfterViewInit, ElementRef } from '@angular/core';
import { ApiService } from '../../shared/services/products.service';
import { SaleApiService } from '../../shared/services/sales.service';
import { SaleDetailApiService } from '../../shared/services/saleDetail.service';
import { ApiService as CustomerApiService } from '../../shared/services/customers.service';
import { ApiService as SupplierApiService } from '../../shared/services/suppliers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentTypes, Sale } from 'src/app/shared/models/sale';
import { SaleDetail } from 'src/app/shared/models/saleDetail';
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
  @ViewChild('QuantityHandler', { static: true }) Quantity: any;
  saleForm: FormGroup;
  productList: any = [];
  customerList: any = [];
  supplierList: any = [];
  currentStringDate: any;
  saleDetailList = [];
  saleId: any;
  showLoading = false;
  selectedSupplier = '';
  selectedCustomer: any;
  selectedPaymentType: any;
  selectedProduct = '';
  date: Date = new Date();
  qty: number;
  rate: number;
  totalAmount: number;
  grossTotal = 0;
  netTotal = 0;
  marketCommittee = 0;
  munshiana = 0;
  labour = 0;
  commission = 0;


  ngOnInit() {
    this.submitBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private salesApi: SaleApiService,
    private productApi: ApiService,
    private customerApi: CustomerApiService,
    private supplierAPi: SupplierApiService,
    private router: Router,
    private ngZone: NgZone,
    private saleDetailApi: SaleDetailApiService
  ) {
    // this.keys = Object.keys(this.paymentTypes).filter(Number);
    this.fillMetaData();
    this.currentStringDate = new Date().toISOString().substring(0, 10);
  }

  InsertCurrentValues() {
    if (this.saleForm.pristine) {
      if (!this.saleForm.valid) {
        this.saleForm.markAllAsTouched();
        alert('Please add basic information to proceed.');
        return;
      }
    }
    this.sendSaleAddRequest();
    if (this.saleId === undefined) {
      this.showLoading = true;
      setTimeout(() => {
        this.processSaleDetail();
        this.showLoading = false;
      }, 2000);
    } else {
      this.processSaleDetail();
    }
    this.Quantity.nativeElement.focus();
  }

  calculateNetTotal() {
    this.netTotal = this.grossTotal - (this.munshiana + this.commission + this.labour + this.marketCommittee);
  }

  finishSale() {
    console.log('Finished');
    this.ngZone.run(() => this.router.navigateByUrl('/sales-list'));
  }

  private processSaleDetail() {
    this.salesApi.GetSale(this.saleId).subscribe(data => {
      const saleDetailObj = this.createSaleDetailForAdd();
      this.grossTotal += this.totalAmount;
      this.netTotal = this.grossTotal - (this.munshiana + this.commission + this.labour + this.marketCommittee);
      this.saleDetailApi.AddSaleDetail(saleDetailObj).subscribe((result: any) => {
        this.saleDetailList.push({
          id: result._id,
          date: this.date,
          qty: this.qty,
          rate: this.rate,
          customerName: this.getCustomerName(),
          paymentType: this.selectedPaymentType,
          productName: this.getProductName(),
          totalAmount: this.totalAmount
        });
        this.resetInputs();
        this.salesApi.UpdateSale(this.saleId, {
          commission: this.commission,
          marketCommittee: this.marketCommittee,
          munshiana: this.munshiana,
          labour: this.labour,
          grossTotal: this.grossTotal,
          netTotal: this.netTotal
        });
      });
    });
  }

  private createSaleDetailForAdd() {
    const saleDetailObj = new SaleDetail();
    saleDetailObj.customer = this.selectedCustomer;
    saleDetailObj.product = this.selectedProduct;
    saleDetailObj.date = this.date;
    saleDetailObj.paymentType = this.selectedPaymentType;
    saleDetailObj.qty = this.qty;
    saleDetailObj.rate = this.rate;
    saleDetailObj.totalAmount = this.totalAmount;
    saleDetailObj.sale = this.saleId;
    return saleDetailObj;
  }

  private sendSaleAddRequest() {
    if (this.saleId === undefined) {
      const saleObj = new Sale();
      saleObj.truckNumber = this.saleForm.value.truckNumber;
      saleObj.builtyNumber = this.saleForm.value.builtyNumber;
      saleObj.description = this.saleForm.value.description;
      saleObj.truckRent = this.saleForm.value.truckRent;
      saleObj.saleDate = new Date();
      saleObj.grossTotal = this.grossTotal;
      saleObj.netTotal = this.netTotal;
      saleObj.marketCommittee = this.marketCommittee;
      saleObj.munshiana = this.munshiana;
      saleObj.labour = this.labour;
      saleObj.commission = this.commission;
      saleObj.supplier = this.selectedSupplier;
      this.salesApi.AddSale(saleObj).subscribe(data => {
        this.saleId = data._id;
      });
    }
  }

  onEdit($event, id) {
    this.saleDetailApi.GetSaleDetail(id).subscribe((result: any) => {
      this.selectedCustomer = result.customer;
      this.date = result.date;
      this.selectedProduct = result.product;
      this.selectedPaymentType = result.paymentType;
      this.qty = result.qty;
      this.rate = result.rate;
      this.totalAmount = result.totalAmount;
      this.grossTotal = 0;
      this.netTotal = 0;
      this.saleDetailList = this.saleDetailList.filter((obj) => {
        this.grossTotal += obj.totalAmount;
        return obj.id !== id;
      });
      this.calculateNetTotal();
      this.saleDetailApi.DeleteSaleDetail(id);
      this.Quantity.nativeElement.focus();
    });
  }

  onDelete($event, id) {
    this.saleDetailApi.DeleteSaleDetail(id);
  }

  onChangeRate() {
    this.totalAmount = this.rate * this.qty;
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

  private getCustomerName(customerId?) {
    let customerName = '';
    if (customerId === undefined) {
      customerId = this.selectedCustomer;
    }
    this.customerList.forEach(element => {
      if (element._id === customerId) {
        customerName = element.name;
      }
    });
    return customerName;
  }

  private getProductName() {
    let productName = '';
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

  private resetInputs() {
    this.qty = 0;
    this.rate = 0;
    this.totalAmount = 0;
    this.date = this.currentStringDate;
  }

  submitBookForm() {
    this.saleForm = this.fb.group({
      builtyNumber: [''],
      truckRent: ['', [Validators.required]],
      description: [''],
      saleDate: ['', [Validators.required]],
      truckNumber: ['', [Validators.required]],
      supplier: ['', [Validators.required]],
      munshiana: ['', [Validators.required]],
      marketCommittee: ['', [Validators.required]],
      labout: ['', [Validators.required]],
      commission: ['', [Validators.required]]
    });
  }

  handleError = (controlName: string, errorName: string) => {
    return this.saleForm.controls[controlName].hasError(errorName);
  }
}
