import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from '../../shared/services/suppliers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})

export class AddSupplierComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('resetSupplierForm', { static: true }) myNgForm;
  supplierForm: FormGroup;

  ngOnInit() {
    this.submitBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private supplierApi: ApiService
  ) { }

  /* Reactive book form */
  submitBookForm() {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.supplierForm.controls[controlName].hasError(errorName);
  }

  submitSupplierForm() {
    if (this.supplierForm.valid) {
      this.supplierApi.AddSupplier(this.supplierForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/suppliers-list'));
      });
    }
  }
}
