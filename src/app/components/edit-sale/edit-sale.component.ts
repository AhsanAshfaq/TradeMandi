import { Router, ActivatedRoute } from '@angular/router';
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
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-edit-sale',
  templateUrl: './edit-sale.component.html',
  styleUrls: ['./edit-sale.component.css']
})

export class EditSaleComponent implements OnInit {
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
  date = new Date().toISOString().substring(0, 10);
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

  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private saleApi: SaleApiService,
    private productApi: ApiService,
    private customerApi: CustomerApiService,
    private supplierApi: SupplierApiService,
    private saleDetailApi: SaleDetailApiService
  ) {
    this.fillMetaData();
    this.updateBookForm();
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.saleId = id;
    this.saleApi.GetSale(id).subscribe(data => {
      this.munshiana = data.munshiana;
      this.marketCommittee = data.marketCommittee;
      this.labour = data.labour;
      this.commission = data.commission;
      data.saleDetails.forEach(element => {
        this.saleDetailApi.GetSaleDetail(element).subscribe((result: any) => {
          this.customerList.forEach(customer => {
            if (customer._id === result.customer) {
              result.customerName = customer.name;
            }
          });
          this.productList.forEach(product => {
            if (product._id === result.product) {
              result.productName = product.name;
            }
          });
          if (result.sale !== undefined) {
            this.saleDetailList.push(result);
          }
          this.calculateNetTotal();
          this.netTotal = this.grossTotal - (this.munshiana + this.commission + this.labour + this.marketCommittee);
        });
      });
      this.saleForm = this.fb.group({
        builtyNumber: [data.builtyNumber],
        truckRent: [data.truckRent, [Validators.required]],
        description: [data.description],
        truckNumber: [data.truckNumber, [Validators.required]],
        supplier: [data.supplier, [Validators.required]]
      });
    });
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

  private processSaleDetail() {
    this.saleApi.GetSale(this.saleId).subscribe(data => {
      const saleDetailObj = this.createSaleDetailForAdd();
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
        this.munshiana += this.qty * environment.munshiana;
        this.calculateNetTotal();
        this.resetInputs();
        this.saleApi.UpdateSale(this.saleId, {
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
      this.saleApi.AddSale(saleObj).subscribe(data => {
        this.saleId = data._id;
      });
    }
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
    this.date = new Date().toISOString().substring(0, 10);
  }
  updateSaleInfo() {
    this.saleApi.UpdateSale(this.saleId, {
      builtyNumber: this.saleForm.value.builtyNumber,
      truckNumber: this.saleForm.value.truckNumber,
      truckRent: this.saleForm.value.truckRent,
      description: this.saleForm.value.description
    });
  }

  onEdit(id) {
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
        return obj._id !== id;
      });
      this.calculateNetTotal();
      this.saleDetailApi.DeleteSaleDetail(id);
      this.Quantity.nativeElement.focus();
    });
  }
  onChangeRate() {
    this.totalAmount = this.rate * this.qty;
  }
  finishSale() {
    this.showLoading = true;
    this.saleDetailApi.UpdateSaleDetailsBySaleId(this.saleId).subscribe((data: any) => {
      console.log(data);
    });
    this.saleApi.UpdateSale(this.saleId, {
      builtyNumber: this.saleForm.value.builtyNumber,
      truckNumber: this.saleForm.value.truckNumber,
      truckRent: this.saleForm.value.truckRent,
      description: this.saleForm.value.description,
      grossTotal: this.grossTotal,
      netTotal: this.netTotal,
      munshiana: this.munshiana,
      marketCommittee: this.marketCommittee,
      labour: this.labour,
      commission: this.commission
    }, true);
    setTimeout(() => {
      console.log('Finished');
      this.showLoading = false;
      this.ngZone.run(() => this.router.navigateByUrl('/sales-list'));
    }, 1000);
  }

  formatDate(e) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.saleForm.get('saleDate').setValue(convertDate, {
      onlyself: true
    });
  }
  calculateNetTotal() {
    this.grossTotal = 0;
    this.netTotal = 0;
    this.saleDetailList.forEach(element => {
      this.grossTotal += element.totalAmount;
    });
    this.supplierApi.GetSupplier(this.selectedSupplier).subscribe((data) => {
      this.commission = this.grossTotal / 100 * data.commissionPercentage;
      this.marketCommittee = this.grossTotal / 100 * environment.marketCommittee;
      this.netTotal = this.grossTotal - (this.munshiana + this.commission + this.labour + this.marketCommittee);
    });
  }
  fillMetaData() {
    this.supplierApi.GetSuppliers().subscribe(data => {
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
  /* Reactive book form */
  updateBookForm() {
    this.saleForm = this.fb.group({
      builtyNumber: [''],
      truckRent: ['', [Validators.required]],
      description: [''],
      truckNumber: ['', [Validators.required]],
      supplier: ['', [Validators.required]]
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.saleForm.controls[controlName].hasError(errorName);
  }

  updateSaleForm() {
    console.log(this.saleForm.value);
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you want to update?')) {
      this.saleApi.UpdateSale(id, this.saleForm.value);
      setTimeout(() => {
        this.ngZone.run(() => this.router.navigateByUrl('/sales-list'));
      }, 1000);
    }
  }
}
