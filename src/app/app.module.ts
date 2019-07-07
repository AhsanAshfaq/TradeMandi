import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Angular 8 components */
import { AddStudentComponent } from './components/add-student/add-student.component';
import { EditStudentComponent } from './components/edit-student/edit-student.component';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { AddSupplierComponent } from './components/add-supplier/add-supplier.component';
import { SuppliersListComponent } from './components/suppliers-list/suppliers-list.component';
import { EditSupplierComponent } from './components/edit-supplier/edit-supplier.component';
import { AddPurchaseComponent } from './components/add-purchase/add-purchase.component';
import { PurchasesListComponent } from './components/purchases-list/purchases-list.component';
import { EditPurchaseComponent } from './components/edit-purchase/edit-purchase.component';
import { AddSaleComponent } from './components/add-sale/add-sale.component';
import { SalesListComponent } from './components/sales-list/sales-list.component';
import { EditSaleComponent } from './components/edit-sale/edit-sale.component';

/* Angular material */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './material.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
/* Angular 8 http service */
import { HttpClientModule } from '@angular/common/http';

/* Angular 8 CRUD services */
import { ApiService } from './shared/services/students.service';

/* Reactive form services in Angular 8 */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    AddStudentComponent,
    EditStudentComponent,
    StudentsListComponent,
    AddUserComponent,
    EditUserComponent,
    UsersListComponent,
    AddProductComponent,
    EditProductComponent,
    ProductsListComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    CustomersListComponent,
    AddSupplierComponent,
    EditSupplierComponent,
    SuppliersListComponent,
    AddPurchaseComponent,
    PurchasesListComponent,
    EditPurchaseComponent,
    AddSaleComponent,
    EditSaleComponent,
    SalesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    MatMenuModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
