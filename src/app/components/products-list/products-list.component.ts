import { Product } from '../../shared/models/product';
import { ApiService } from '../../shared/services/products.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})

export class ProductsListComponent implements OnInit {
  ProductData: any = [];
  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['_id', 'name', 'quantity', 'productWarningLimit', 'action'];

  constructor(private productApi: ApiService) {
    this.productApi.GetProducts().subscribe(data => {
      this.ProductData = data;
      console.log(this.ProductData);
      this.dataSource = new MatTableDataSource<Product>(this.ProductData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }

  ngOnInit() { }

  deleteProduct(index: number, e) {
    if (window.confirm('Are you sure')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.productApi.DeleteProduct(e._id).subscribe();
    }
  }
}
