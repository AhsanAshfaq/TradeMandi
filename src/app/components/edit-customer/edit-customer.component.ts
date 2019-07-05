import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from '../../shared/services/customers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})

export class EditCustomerComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('resetCustomerForm', { static: true }) myNgForm;
  customerForm: FormGroup;

  ngOnInit() {
    this.updateBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private customerApi: ApiService
  ) {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.customerApi.GetCustomer(id).subscribe(data => {
      console.log(data.subjects);
      this.customerForm = this.fb.group({
        name: [data.name, [Validators.required]],
        phone: [data.phone, [Validators.required]],
        address: [data.address, [Validators.required]],
        city: [data.city, [Validators.required]]
      });
    });
  }

  /* Reactive book form */
  updateBookForm() {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.customerForm.controls[controlName].hasError(errorName);
  }

  updateCustomerForm() {
    console.log(this.customerForm.value);
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you want to update?')) {
      this.customerApi.UpdateCustomer(id, this.customerForm.value).subscribe( res => {
        this.ngZone.run(() => this.router.navigateByUrl('/customers-list'));
      });
    }
  }
}
