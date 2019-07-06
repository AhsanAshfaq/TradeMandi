import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'add-user' },
  { path: 'add-student', component: AddStudentComponent },
  { path: 'edit-student/:id', component: EditStudentComponent },
  { path: 'students-list', component: StudentsListComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'users-list', component: UsersListComponent },
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'products-list', component: ProductsListComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: 'add-customer', component: AddCustomerComponent },
  { path: 'customers-list', component: CustomersListComponent },
  { path: 'edit-customer/:id', component: EditCustomerComponent },
  { path: 'add-supplier', component: AddSupplierComponent },
  { path: 'suppliers-list', component: SuppliersListComponent },
  { path: 'edit-supplier/:id', component: EditSupplierComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
