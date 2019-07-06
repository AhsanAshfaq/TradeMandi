import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from '../../shared/services/suppliers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.css']
})

export class EditSupplierComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('resetSupplierForm', { static: true }) myNgForm;
  supplierForm: FormGroup;

  ngOnInit() {
    this.updateBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private supplierApi: ApiService
  ) {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.supplierApi.GetSupplier(id).subscribe(data => {
      this.supplierForm = this.fb.group({
        name: [data.name, [Validators.required]],
        phone: [data.phone, [Validators.required]],
        address: [data.address, [Validators.required]],
        city: [data.city, [Validators.required]],
        balance: [data.balance, [Validators.required]]
      });
    });
  }

  /* Reactive book form */
  updateBookForm() {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      balance: ['', [Validators.required]]
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.supplierForm.controls[controlName].hasError(errorName);
  }

  updateSupplierForm() {
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you want to update?')) {
      this.supplierApi.UpdateSupplier(id, this.supplierForm.value).subscribe( res => {
        this.ngZone.run(() => this.router.navigateByUrl('/suppliers-list'));
      });
    }
  }
}
