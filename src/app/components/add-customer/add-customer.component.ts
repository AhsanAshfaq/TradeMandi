import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from '../../shared/services/customers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})

export class AddCustomerComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('resetCustomerForm', { static: true }) myNgForm;
  customerForm: FormGroup;

  ngOnInit() {
    this.submitBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private customerApi: ApiService
  ) { }

  /* Reactive book form */
  submitBookForm() {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      balance: ['', [Validators.required]]
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.customerForm.controls[controlName].hasError(errorName);
  }

  submitCustomerForm() {
    if (this.customerForm.valid) {
      this.customerApi.AddCustomer(this.customerForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/customers-list'));
      });
    }
  }
}
