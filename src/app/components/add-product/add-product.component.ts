import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from '../../shared/services/products.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UnitTypes } from '../../shared/models/product';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})

export class AddProductComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  unitTypes = UnitTypes;
  keys: string[];
  @ViewChild('resetProductForm', { static: true }) myNgForm;
  productForm: FormGroup;

  ngOnInit() {
    this.submitBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private productApi: ApiService
  ) {
    this.keys = Object.keys(this.unitTypes).filter(Number);
  }

  /* Reactive book form */
  submitBookForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      purchaseWarningLimit: ['', [Validators.required]],
      unit: [UnitTypes.Bag.toString(), [Validators.required]]
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.productForm.controls[controlName].hasError(errorName);
  }

  submitProductForm() {
    if (this.productForm.valid) {
      this.productApi.AddProduct(this.productForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/products-list'));
      });
    }
  }
}
