import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ApiService } from '../../shared/services/products.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UnitTypes } from '../../shared/models/product';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})

export class EditProductComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild('resetProductForm', { static: true }) myNgForm;
  productForm: FormGroup;
  unitTypes = UnitTypes;
  keys: string[];

  ngOnInit() {
    this.updateBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private productApi: ApiService
  ) {
    this.keys = Object.keys(this.unitTypes).filter(Number);
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.productApi.GetProduct(id).subscribe(data => {
      console.log(data.subjects);
      this.productForm = this.fb.group({
        name: [data.name, [Validators.required]],
        quantity: [data.quantity, [Validators.required]],
        description: [data.description, [Validators.required]],
        productWarningLimit: [data.productWarningLimit, [Validators.required]],
        unit: [data.unit.toString(), [Validators.required]]
      });
    });
  }

  /* Reactive book form */
  updateBookForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      description: ['', [Validators.required]],
      productWarningLimit: ['', [Validators.required]],
      unit: ['', [Validators.required]]
    });
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.productForm.controls[controlName].hasError(errorName);
  }

  updateProductForm() {
    console.log(this.productForm.value);
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (window.confirm('Are you sure you want to update?')) {
      this.productApi.UpdateProduct(id, this.productForm.value).subscribe( res => {
        this.ngZone.run(() => this.router.navigateByUrl('/products-list'));
      });
    }
  }
}
